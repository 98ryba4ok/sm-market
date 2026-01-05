# Папка с изображениями для create_sample_data

Положите следующие изображения в эту папку:

## Категории (6 файлов)
- `santehnika.png` - Сантехника
- `kuhni.png` - Кухни
- `unitazy.png` - Унитазы
- `plitka.png` - Плитка
- `vanny.png` - Ванны
- `mebel.png` - Мебель для ванны

## Бренды (5 файлов)
- `gessi.png` - GESSI
- `cielo.png` - cielo
- `jorger.png` - Jorger
- `kronos.png` - KRONOS ceramiche
- `devon.png` - DevoN&DevoN

## Баннеры (2 файла)
- `banner1.png` - Новая коллекция смесителей GESSI Perle
- `banner2.png` - Эксклюзивная итальянская плитка

## Товар (1 файл)
- `product.png` - Кухонный смеситель Omoikiri Shinagawa-C

---

После добавления изображений запустите:
```bash
docker-compose exec backend python manage.py create_sample_data --clear
```

Скрипт автоматически загрузит изображения из этой папки в базу данных.
