#!/bin/zsh
set -e
cd "$(dirname "$0")"
site_python="$PWD/.venv/bin/python"
if command -v node >/dev/null 2>&1; then
  site_node="$(command -v node)"
else
  site_node="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ ! -x "$site_python" || ! -x "$site_node" || ! -f frontend/node_modules/vite/bin/vite.js ]]; then
  echo 'Не найдены зависимости. Инструкция: СКЛАД — запуск и проверка.md'
  read -r '?Нажмите Enter, чтобы закрыть окно.'
  exit 1
fi
if lsof -tiTCP:8000 -sTCP:LISTEN >/dev/null || lsof -tiTCP:5173 -sTCP:LISTEN >/dev/null; then
  echo 'Порт 8000 или 5173 уже занят. Если склад запущен, откройте http://127.0.0.1:5173/warehouse'
  echo 'Чтобы запустить заново, сначала остановите прежний сервер.'
  read -r '?Нажмите Enter, чтобы закрыть окно.'
  exit 0
fi
"$site_python" backend/manage.py migrate --settings=config.settings_local
"$site_python" backend/manage.py seed_warehouse_demo --settings=config.settings_local
"$site_python" backend/manage.py runserver 127.0.0.1:8000 --settings=config.settings_local &
site_backend_pid=$!
trap 'kill "$site_backend_pid" 2>/dev/null || true' EXIT INT TERM
printf '\nОткройте http://127.0.0.1:5173/warehouse\nВход: warehouse@local.test\nПароль: Warehouse-demo-2026!\nДля остановки нажмите Ctrl+C.\n\n'
cd frontend
LOCAL_BACKEND_URL=http://127.0.0.1:8000 "$site_node" node_modules/vite/bin/vite.js --host 127.0.0.1
