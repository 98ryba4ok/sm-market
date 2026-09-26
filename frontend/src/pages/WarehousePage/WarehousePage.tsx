import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDownLeft, ArrowUpRight, Boxes, ClipboardList, PackagePlus, Search, X, LogOut, RefreshCw, Store, Package, Undo2 } from 'lucide-react';

import api from '../../api/axios';
import { authApi } from '../../api/authApi';
import './WarehousePage.css';

type Product = { id: number; name: string; sku: string; category_name: string; category: number; units_per_box: number; price: string; stock_quantity: number; balance: number; boxes: number; pieces: number };
type Movement = { id: number; product_name: string; sku: string; kind: string; kind_display: string; quantity: number; units_per_box: number; unit_price: string; total: string; occurred_at: string; actor_name: string; order_number: string | null; note: string; can_reverse: boolean; reverses: number | null };
type Overview = { products: number; units: number; empty: number; received_today: number; spent_today: number; started_at: string | null; categories: {id: number; name: string}[]; employee: string };
type Page<T> = { count: number; results: T[]; next: string | null; previous: string | null };
type Modal = 'receipt' | 'expense' | 'product' | 'reverse' | 'packaging' | null;
const money = (value: string | number) => new Intl.NumberFormat('ru-RU', {style:'currency',currency:'RUB',maximumFractionDigits:2}).format(Number(value));
const dateTime = (value: string) => new Date(value).toLocaleString('ru-RU', {timeZone:'Europe/Moscow',dateStyle:'short',timeStyle:'short'});
const nowMoscow = () => new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 16);
function errorText(error: unknown): string {
  const data = (error as {response?: {data?: unknown}}).response?.data;
  if (typeof data === 'string') return data.startsWith('<') ? 'Сервер недоступен. Повторите попытку.' : data;
  if (data && typeof data === 'object') return Object.values(data).map(value => Array.isArray(value) ? value.join(' ') : String(value)).join(' ');
  return 'Не удалось связаться с сервером. Проверьте подключение и повторите попытку.';
}

export const WarehousePage = () => {
  const [access, setAccess] = useState<'loading'|'login'|'denied'|'ready'>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [tab, setTab] = useState<'stock'|'history'>('stock');
  const [products, setProducts] = useState<Page<Product>>({count:0,results:[],next:null,previous:null});
  const [movements, setMovements] = useState<Page<Movement>>({count:0,results:[],next:null,previous:null});
  const [search, setSearch] = useState('');
  const [asOf, setAsOf] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [kind, setKind] = useState('');
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [modal, setModal] = useState<Modal>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [picker, setPicker] = useState<Product[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [boxes, setBoxes] = useState('0');
  const [pieces, setPieces] = useState('0');
  const [price, setPrice] = useState('');
  const [when, setWhen] = useState(nowMoscow());
  const [note, setNote] = useState('');
  const [requestId, setRequestId] = useState('');
  const [reversing, setReversing] = useState<Movement | null>(null);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [pack, setPack] = useState('1');

  const refresh = () => setRevision(value => value + 1);
  const checkAccess = useCallback(async () => {
    if (!localStorage.getItem('accessToken')) { setAccess('login'); return; }
    try {
      const user = (await authApi.me()).data;
      setAccess(user.is_staff ? 'ready' : 'denied');
    } catch { setAccess('login'); }
  }, []);
  useEffect(() => { void checkAccess(); }, [checkAccess]);
  useEffect(() => {
    const expired = () => { setAccess('login'); setModal(null); };
    window.addEventListener('openLoginModal', expired);
    return () => window.removeEventListener('openLoginModal', expired);
  }, []);
  useEffect(() => {
    if (access !== 'ready') return;
    let cancelled = false;
    api.get<Overview>('/inventory/overview/').then(result => { if (!cancelled) setOverview(result.data); }).catch(err => { if (!cancelled) setError(errorText(err)); });
    return () => { cancelled = true; };
  }, [access, revision]);
  useEffect(() => {
    if (access !== 'ready') return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try {
        if (tab === 'stock') {
          const response = await api.get<Page<Product>>('/inventory/products/', {params:{search,as_of:asOf || undefined,page}});
          if (!cancelled) setProducts(response.data);
        } else {
          const response = await api.get<Page<Movement>>('/inventory/movements/', {params:{search,date_from:from || undefined,date_to:to || undefined,kind:kind || undefined,page}});
          if (!cancelled) setMovements(response.data);
        }
      } catch (err) { if (!cancelled) setError(errorText(err)); }
      finally { if (!cancelled) setLoading(false); }
    }, 200);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [access, tab, search, asOf, from, to, kind, page, revision]);
  useEffect(() => {
    if (modal !== 'receipt' && modal !== 'expense') return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setPickerLoading(true);
      try {
        const response = await api.get<Page<Product>>('/inventory/products/', {params:{search:pickerSearch,page_size:100}});
        if (!cancelled) setPicker(response.data.results);
      } catch (err) { if (!cancelled) setFormError(errorText(err)); }
      finally { if (!cancelled) setPickerLoading(false); }
    }, 150);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [modal, pickerSearch]);
  const openMovement = (type: 'receipt'|'expense', product: Product | null = null) => {
    setSelected(product); setPickerSearch(''); setBoxes('0'); setPieces('0');
    setPrice(type === 'expense' && product ? product.price : ''); setWhen(nowMoscow()); setNote('');
    setRequestId(crypto.randomUUID()); setFormError(''); setModal(type);
  };
  const openProduct = () => { setName(''); setSku(''); setPack('1'); setPrice(''); setCategory(String(overview?.categories[0]?.id || '')); setFormError(''); setModal('product'); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setFormError('');
    try {
      if (modal === 'receipt' || modal === 'expense') {
        if (!selected) throw new Error('Выберите товар');
        await api.post('/inventory/movements/', {product:selected.id,kind:modal,boxes:Number(boxes),pieces:Number(pieces),unit_price:price,occurred_at:`${when}:00+03:00`,note,request_id:requestId});
        setNotice(modal === 'receipt' ? 'Приход сохранён. Остаток пересчитан.' : 'Расход сохранён. Остаток пересчитан.');
      } else if (modal === 'product') {
        await api.post('/inventory/products/', {name,sku,category:Number(category),units_per_box:Number(pack),price});
        setNotice('Товар добавлен с нулевым остатком. Зарегистрируйте приход.');
      } else if (modal === 'reverse' && reversing) {
        await api.post(`/inventory/movements/${reversing.id}/reverse/`, {note});
        setNotice('Создана обратная операция. Исходная запись сохранена в истории.');
      } else if (modal === 'packaging' && selected) {
        await api.patch(`/inventory/products/${selected.id}/packaging/`, {units_per_box:Number(pack)});
        setNotice('Упаковка обновлена. Количество штук на складе не изменилось.');
      }
      setModal(null); refresh();
    } catch (err) { setFormError(errorText(err)); }
    finally { setBusy(false); }
  };
  const login = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await authApi.login({email,password});
      localStorage.setItem('accessToken', response.data.access); localStorage.setItem('refreshToken', response.data.refresh); localStorage.setItem('userEmail',email);
      setPassword(''); await checkAccess();
    } catch (err) { setError(errorText(err)); }
    finally { setBusy(false); }
  };
  const logout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) void authApi.logout({refresh:refreshToken}).catch(() => {});
    ['accessToken','refreshToken','userEmail'].forEach(key => localStorage.removeItem(key));
    setAccess('login'); setOverview(null); setProducts({count:0,results:[],next:null,previous:null}); setMovements({count:0,results:[],next:null,previous:null});
  };
  const quantity = (Number(boxes) || 0) * (selected?.units_per_box || 1) + (Number(pieces) || 0);
  const pagination = tab === 'stock' ? products : movements;
  const title = modal === 'receipt' ? 'Приход товара' : modal === 'expense' ? 'Расход товара' : modal === 'product' ? 'Новый товар' : modal === 'packaging' ? 'Упаковка товара' : 'Исправить операцию';

  if (access !== 'ready') return <main className="warehouse-login">
    <div className="warehouse-login__card"><span className="warehouse-logo"><Boxes size={26} /> SM / Склад</span>
      <h1>{access === 'denied' ? 'Доступ только сотрудникам' : 'Вход в складской учёт'}</h1>
      <p>Приход, расход и остатки товаров в одном месте.</p>
      {access === 'loading' ? <p role="status">Проверяем доступ…</p> : access === 'denied' ? <><p>У этой учётной записи нет прав сотрудника.</p><button onClick={logout}>Войти с другой учётной записью</button></> : <form onSubmit={login}>
        <label>Email<input required type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} /></label>
        <label>Пароль<input required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} /></label>
        {error && <p className="warehouse-error" role="alert">{error}</p>}
        <button disabled={busy}>{busy ? 'Входим…' : 'Войти в склад'}</button>
      </form>}
      <Link to="/">Вернуться в магазин</Link>
    </div>
  </main>;

  return <div className="warehouse">
    <aside className="warehouse-sidebar">
      <Link to="/warehouse" className="warehouse-logo"><Boxes size={28} /><span>SM <b>Склад</b></span></Link>
      <p className="warehouse-sidebar__caption">УПРАВЛЕНИЕ ТОВАРАМИ</p>
      <nav aria-label="Разделы склада">
        <button className={tab === 'stock' ? 'is-active' : ''} onClick={() => {setTab('stock');setPage(1);setSearch('');}}><Boxes size={20} />Остатки</button>
        <button className={tab === 'history' ? 'is-active' : ''} onClick={() => {setTab('history');setPage(1);setSearch('');}}><ClipboardList size={20} />Журнал операций</button>
      </nav>
      <div className="warehouse-sidebar__bottom"><Link to="/"><Store size={18} />Открыть магазин</Link><span>{overview?.employee}</span><button onClick={logout}><LogOut size={17} />Выйти</button></div>
    </aside>
    <main className="warehouse-main">
      <header className="warehouse-topbar"><span>Складской учёт <span className="warehouse-dot" /> Один склад</span><span>Время операций — Москва</span></header>
      <div className="warehouse-heading"><div><p className="warehouse-eyebrow">ТОВАРЫ ПОД КОНТРОЛЕМ</p><h1>{tab === 'stock' ? 'Остатки на складе' : 'Журнал операций'}</h1><p>{tab === 'stock' ? 'Каждое поступление и списание автоматически меняет остаток.' : 'Приход, ручной расход, заказы сайта и возвраты — вся история здесь.'}</p></div>
        <div className="warehouse-actions"><button className="warehouse-button warehouse-button--outline" onClick={() => openMovement('expense')}><ArrowUpRight size={18}/>Расход</button><button className="warehouse-button" onClick={() => openMovement('receipt')}><ArrowDownLeft size={18}/>Приход</button></div>
      </div>
      {notice && <div className="warehouse-notice" role="status">{notice}<button aria-label="Закрыть сообщение" onClick={() => setNotice('')}><X size={16}/></button></div>}
      <section className="warehouse-stats" aria-label="Текущие показатели склада">
        <article><span>Сейчас на складе</span><strong>{overview?.units.toLocaleString('ru-RU') ?? '—'} <small>шт.</small></strong><p>{overview?.products ?? '—'} наименований товаров</p></article>
        <article><span><ArrowDownLeft size={16}/>Поступило сегодня</span><strong className="warehouse-positive">+{overview?.received_today ?? '—'} <small>шт.</small></strong><p>Все поступления, включая возвраты</p></article>
        <article><span><ArrowUpRight size={16}/>Списано сегодня</span><strong>{overview?.spent_today ?? '—'} <small>шт.</small></strong><p>Все списания, включая заказы</p></article>
        <article><span>Закончились</span><strong>{overview?.empty ?? '—'} <small>товаров</small></strong><p>Нулевой остаток на текущий момент</p></article>
      </section>
      <section className="warehouse-panel">
        <div className="warehouse-panel__heading"><h2>{tab === 'stock' ? 'Товары и остатки' : 'История движения'}</h2><div className="warehouse-actions"><button className="warehouse-icon-button" aria-label="Обновить данные" onClick={refresh}><RefreshCw size={17}/></button>{tab === 'stock' && <button className="warehouse-text-button" onClick={openProduct}><PackagePlus size={17}/>Добавить товар</button>}</div></div>
        <div className="warehouse-filters">
          <label className="warehouse-search"><Search size={17}/><input aria-label="Поиск по названию или артикулу" placeholder="Название или артикул товара" value={search} onChange={event => {setSearch(event.target.value);setPage(1);}} /></label>
          {tab === 'stock' ? <label>Остаток на конец дня<input aria-label="Остаток на дату" type="date" value={asOf} max={nowMoscow().slice(0,10)} onChange={event => {setAsOf(event.target.value);setPage(1);}} /></label> : <>
            <label>Тип операции<select value={kind} onChange={event => {setKind(event.target.value);setPage(1);}}><option value="">Все операции</option><option value="receipt">Приход</option><option value="expense">Ручной расход</option><option value="sale">Заказ сайта</option><option value="return">Отмена заказа</option><option value="reversal">Исправление</option><option value="opening">Начальный остаток</option></select></label>
            <label>С даты<input type="date" value={from} onChange={event => {setFrom(event.target.value);setPage(1);}} /></label><label>По дату<input type="date" value={to} onChange={event => {setTo(event.target.value);setPage(1);}} /></label>
          </>}
          {(search || asOf || from || to || kind) && <button className="warehouse-text-button" onClick={() => {setSearch('');setAsOf('');setFrom('');setTo('');setKind('');setPage(1);}}>Сбросить</button>}
        </div>
        {asOf && tab === 'stock' && <p className="warehouse-table-note">Остатки на конец {asOf.split('-').reverse().join('.')} по московскому времени. Верхние показатели — текущие.</p>}
        {overview?.started_at && <p className="warehouse-table-note">История учёта доступна с {dateTime(overview.started_at)}. Более ранние остатки не восстановлены.</p>}
        {error ? <div className="warehouse-error" role="alert">{error}<button onClick={refresh}>Повторить</button></div> : loading ? <div className="warehouse-empty" role="status">Загружаем данные…</div> : <div className="warehouse-table-wrap">
          {tab === 'stock' ? <table><thead><tr><th>Товар / артикул</th><th>Упаковка</th><th>Остаток, шт.</th><th>В коробках и штуках</th><th>Цена продажи / шт.</th><th>Операции</th></tr></thead><tbody>
            {products.results.map(product => <tr key={product.id}><td><strong>{product.name}</strong><span>{product.sku || 'Без артикула'} · {product.category_name}</span></td><td><button className="warehouse-pack" aria-label={`Упаковка: ${product.name}`} onClick={() => {setSelected(product);setPack(String(product.units_per_box));setFormError('');setModal('packaging');}}>{product.units_per_box} шт. / кор.</button></td><td><b className={product.balance === 0 ? 'warehouse-zero' : 'warehouse-stock'}>{product.balance}</b></td><td>{product.boxes} кор. {product.pieces} шт.</td><td>{money(product.price)}</td><td><div className="warehouse-row-actions"><button aria-label={`Приход: ${product.name}`} onClick={() => openMovement('receipt',product)}><ArrowDownLeft size={17}/></button><button aria-label={`Расход: ${product.name}`} onClick={() => openMovement('expense',product)}><ArrowUpRight size={17}/></button></div></td></tr>)}
          </tbody></table> : <table><thead><tr><th>Дата и время</th><th>Товар</th><th>Операция</th><th>Количество, шт.</th><th>Цена / шт.</th><th>Сумма</th><th>Основание / сотрудник</th><th></th></tr></thead><tbody>
            {movements.results.map(item => <tr key={item.id}><td>{dateTime(item.occurred_at)}<span>№ {item.id}</span></td><td><strong>{item.product_name}</strong><span>{item.sku}</span></td><td><span className={`warehouse-badge warehouse-badge--${item.quantity > 0 ? 'in' : 'out'}`}>{item.kind_display}</span></td><td className={item.quantity > 0 ? 'warehouse-positive' : ''}><strong>{item.quantity > 0 ? '+' : ''}{item.quantity}</strong><span>{Math.floor(Math.abs(item.quantity)/item.units_per_box)} кор. {Math.abs(item.quantity)%item.units_per_box} шт.</span></td><td>{money(item.unit_price)}</td><td>{item.kind === 'opening' ? '—' : money(item.total)}</td><td><strong>{item.order_number || item.note || '—'}</strong><span>{item.actor_name}{item.reverses ? ` · исправление № ${item.reverses}` : ''}</span></td><td>{item.can_reverse && <button className="warehouse-icon-button" aria-label={`Исправить операцию ${item.id}`} onClick={() => {setReversing(item);setNote('');setFormError('');setModal('reverse');}}><Undo2 size={16}/></button>}</td></tr>)}
          </tbody></table>}
          {pagination.results.length === 0 && <div className="warehouse-empty"><Package size={30}/><h3>Записей пока нет</h3><p>Измените фильтры или добавьте товар и зарегистрируйте приход.</p></div>}
        </div>}
        <div className="warehouse-pagination"><span>Найдено: {pagination.count}</span><div><button disabled={!pagination.previous || loading} onClick={() => setPage(value => value-1)}>Назад</button><span>Страница {page}</span><button disabled={!pagination.next || loading} onClick={() => setPage(value => value+1)}>Далее</button></div></div>
      </section>
      <p className="warehouse-footnote">Заказ сайта списывает товар при оформлении. Отмена заказа возвращает его на склад. Количество коробок рассчитывается по указанной упаковке.</p>
    </main>
    <Dialog.Root open={modal !== null} onOpenChange={open => {if (!open && !busy) setModal(null);}}><Dialog.Portal><Dialog.Overlay className="warehouse-overlay"/><Dialog.Content className="warehouse-dialog" aria-describedby="warehouse-dialog-description">
      <Dialog.Title>{title}</Dialog.Title><Dialog.Description id="warehouse-dialog-description">{modal === 'reverse' ? 'Создадим обратную операцию текущим временем. Исходная запись останется в журнале.' : modal === 'packaging' ? 'Изменяется только пересчёт коробок. Прошлые операции сохранят свою упаковку.' : 'После сохранения данные будут доступны в складском учёте.'}</Dialog.Description>
      <Dialog.Close className="warehouse-dialog__close" disabled={busy} aria-label="Закрыть форму"><X size={20}/></Dialog.Close>
      <form onSubmit={submit}>
        {(modal === 'receipt' || modal === 'expense') && <>
          <label>Найти товар<input placeholder="Введите название или артикул" value={pickerSearch} onChange={event => setPickerSearch(event.target.value)} /></label>
          <label>Товар<select required value={selected?.id || ''} onChange={event => {const item=picker.find(product => product.id === Number(event.target.value)) || null;setSelected(item);setPrice(modal === 'expense' && item ? item.price : '');}}><option value="">{pickerLoading ? 'Загружаем…' : 'Выберите товар'}</option>{selected && !picker.some(product => product.id === selected.id) && <option value={selected.id}>{selected.name} · {selected.sku}</option>}{picker.map(product => <option key={product.id} value={product.id}>{product.name} · {product.sku}</option>)}</select></label>
          {selected && <p className="warehouse-form-info">В коробке {selected.units_per_box} шт. · Сейчас доступно {selected.stock_quantity} шт.</p>}
          <div className="warehouse-form-grid"><label>Коробок<input required type="number" min="0" max="1000000" step="1" value={boxes} onChange={event => setBoxes(event.target.value)} /></label><label>Отдельных штук<input required type="number" min="0" max="100000000" step="1" value={pieces} onChange={event => setPieces(event.target.value)} /></label></div>
          <div className="warehouse-form-grid"><label>{modal === 'receipt' ? 'Закупочная цена за штуку, ₽' : 'Цена расхода за штуку, ₽'}<input required type="number" min="0" max="99999999.99" step="0.01" value={price} onChange={event => setPrice(event.target.value)} /></label><label>Дата и время · Москва<input required type="datetime-local" value={when} max={nowMoscow()} onChange={event => setWhen(event.target.value)} /></label></div>
          <label>Основание / комментарий<input maxLength={500} placeholder={modal === 'receipt' ? 'Например: поставка, накладная № 12' : 'Например: продажа со склада, списание брака'} value={note} onChange={event => setNote(event.target.value)} /></label>
          <div className="warehouse-form-total"><span>Итого: <b>{quantity} шт.</b></span><strong>{money(quantity * Number(price || 0))}</strong></div>
        </>}
        {modal === 'product' && <>
          <label>Название товара<input required maxLength={200} value={name} onChange={event => setName(event.target.value)} /></label>
          <label>Артикул<input required maxLength={100} value={sku} onChange={event => setSku(event.target.value)} /></label>
          <label>Категория<select required value={category} onChange={event => setCategory(event.target.value)}><option value="">Выберите категорию</option>{overview?.categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <div className="warehouse-form-grid"><label>Штук в коробке<input required min="1" max="1000000" step="1" type="number" value={pack} onChange={event => setPack(event.target.value)}/></label><label>Цена продажи за штуку, ₽<input required type="number" min="0" max="99999999.99" step="0.01" value={price} onChange={event => setPrice(event.target.value)} /></label></div><p className="warehouse-form-info">Новый товар появится с нулевым остатком. Поступление оформляется кнопкой «Приход».</p>
        </>}
        {modal === 'packaging' && <><p>{selected?.name}</p><label>Штук в коробке<input required min="1" max="1000000" step="1" type="number" value={pack} onChange={event => setPack(event.target.value)}/></label></>}
        {modal === 'reverse' && <><p>№ {reversing?.id} · {reversing?.product_name} · {reversing?.quantity} шт.</p><label>Причина исправления<input required maxLength={500} value={note} onChange={event => setNote(event.target.value)}/></label></>}
        {formError && <p className="warehouse-error" role="alert">{formError}</p>}
        <div className="warehouse-dialog__actions"><button type="button" className="warehouse-button warehouse-button--outline" disabled={busy} onClick={() => setModal(null)}>Отмена</button><button className="warehouse-button" disabled={busy || ((modal === 'receipt' || modal === 'expense') && (!selected || quantity <= 0))}>{busy ? 'Сохраняем…' : 'Сохранить'}</button></div>
      </form>
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>;
};
