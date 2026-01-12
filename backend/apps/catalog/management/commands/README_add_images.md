# Добавление изображений для товаров

## Описание
Management команда `add_product_images` добавляет изображение `смеситель.png` для всех товаров в базе данных.

## Подготовка

Убедитесь, что файл `/backend/media/products/смеситель.png` существует.
Файл уже скопирован из `frontend/src/assets/смеситель.png`.

## Запуск команды

### Вариант 1: Через Docker (рекомендуется)

```bash
# Убедитесь, что контейнеры запущены
docker-compose up -d

# Запустите команду в контейнере backend
docker-compose exec backend python manage.py add_product_images
```

### Вариант 2: Локально (с виртуальным окружением)

```bash
cd backend

# Активируйте виртуальное окружение
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# Запустите команду
python manage.py add_product_images
```

## Опции команды

### Базовое использование
```bash
python manage.py add_product_images
```
Добавляет изображение только для товаров **без изображений**.

### С флагом --force
```bash
python manage.py add_product_images --force
```
Добавляет изображение **для всех товаров**, даже если у них уже есть изображения.

## Что делает команда

1. ✅ Проверяет наличие файла `media/products/смеситель.png`
2. ✅ Находит все товары в базе данных
3. ✅ Для каждого товара без изображений:
   - Создает запись `ProductImage` с файлом `смеситель.png`
   - Устанавливает флаг `is_main=True`
   - Добавляет alt_text с названием товара
4. ✅ Выводит статистику выполнения

## Пример вывода

```
Найдено товаров: 5
✓ Добавлено изображение для: Кухонный смеситель Omoikiri Shinagawa-C
✓ Добавлено изображение для: Кухонный смеситель Omoikiri Shinagawa-C #2
✓ Добавлено изображение для: Кухонный смеситель Omoikiri Shinagawa-C #3
✓ Добавлено изображение для: Кухонный смеситель Omoikiri Shinagawa-C #4
✓ Добавлено изображение для: Кухонный смеситель Omoikiri Shinagawa-C #5

=== Готово ===
Добавлено изображений: 5
```

## Проверка результата

После выполнения команды вы можете:

1. **Через Django Admin** (http://localhost:8000/admin)
   - Войдите в админ панель
   - Перейдите в раздел "Изображения товаров" (Product Images)
   - Убедитесь, что изображения добавлены

2. **Через API**
   ```bash
   # Получить список товаров с изображениями
   curl http://localhost:8000/api/catalog/products/
   ```

3. **Через Frontend** (http://localhost:5173)
   - Откройте каталог товаров
   - Все товары должны отображаться с изображением смесителя

## Возможные ошибки

### Ошибка: "Файл изображения не найден"
**Причина**: Файл `смеситель.png` отсутствует в директории `backend/media/products/`

**Решение**: 
```bash
cp frontend/src/assets/смеситель.png backend/media/products/смеситель.png
```

### Ошибка: "В базе данных нет товаров"
**Причина**: База данных пуста

**Решение**: Создайте тестовые данные
```bash
docker-compose exec backend python manage.py create_sample_data
```

## Дополнительная информация

- **Файл команды**: `backend/apps/catalog/management/commands/add_product_images.py`
- **Модель**: `ProductImage` (apps.catalog.models)
- **Связь**: `ProductImage` → `Product` (ForeignKey)
- **Загрузка**: Изображения хранятся в `media/products/`

## Удаление изображений

Если нужно удалить добавленные изображения:

```python
# Через Django shell
docker-compose exec backend python manage.py shell

>>> from apps.catalog.models import ProductImage
>>> ProductImage.objects.filter(image='products/смеситель.png').delete()
```
