# Guía para Push a GitHub - ARDF SDK

El código está listo para hacer push. Solo necesitas autenticarte con tus credenciales de GitHub.

## ✅ Ya Configurado

- ✅ Git repository inicializado
- ✅ Remote configurado: `https://github.com/MauricioPerera/ardf-sdk.git`
- ✅ package.json actualizado con la URL correcta
- ✅ Documentación actualizada
- ✅ 2 commits creados:
  1. Initial commit con todo el código
  2. Update repository URLs

## 🚀 Opción 1: Push con HTTPS (Recomendado)

```bash
cd /opt/ideas-api/mcp-server

# Hacer push (te pedirá usuario y password/token)
git push -u origin main
```

Cuando te pida credenciales:
- **Username**: MauricioPerera
- **Password**: Usa un **Personal Access Token** (no tu password)

### Crear Personal Access Token:

1. Ve a: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Classic"**
3. Dale un nombre: "ARDF SDK Deploy"
4. Marca permisos: `repo` (full control)
5. Click **"Generate token"**
6. **Copia el token** (solo se muestra una vez)
7. Úsalo como password en el push

## 🚀 Opción 2: Push con SSH (Más Seguro)

### Configurar SSH Key:

```bash
# Generar SSH key
ssh-keygen -t ed25519 -C "tu@email.com"

# Copiar la clave pública
cat ~/.ssh/id_ed25519.pub
```

### Agregar a GitHub:

1. Ve a: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Pega el contenido de `id_ed25519.pub`
4. Click **"Add SSH key"**

### Cambiar remote a SSH:

```bash
cd /opt/ideas-api/mcp-server
git remote set-url origin git@github.com:MauricioPerera/ardf-sdk.git
git push -u origin main
```

## 📊 Verificar Push

Una vez que hagas push, verifica en:
https://github.com/MauricioPerera/ardf-sdk

Deberías ver:
- 9 archivos
- README.md visible
- 2 commits
- LICENSE (MIT)

## 🎯 Próximo Paso Después del Push

Una vez que el código esté en GitHub, puedes publicar a npm:

```bash
cd /opt/ideas-api/mcp-server

# Login a npm (solo primera vez)
npm login

# Build el proyecto
bun build src/index.ts --outdir dist --target node --format esm
chmod +x dist/index.js

# Publicar
npm publish --access public
```

## 📝 Archivos en el Repo

```
ardf-sdk/
├── src/
│   └── index.ts          (350 líneas - MCP Server)
├── dist/                 (auto-generado en build)
├── README.md             (303 líneas - Documentación)
├── LAUNCH.md             (587 líneas - Marketing)
├── DEPLOYMENT_GUIDE.md   (Guía de despliegue)
├── LICENSE               (MIT)
├── package.json
├── tsconfig.json
├── bun.lock
└── .gitignore
```

## ⚡ Comando Rápido

```bash
# Si ya tienes token/SSH configurado:
cd /opt/ideas-api/mcp-server
git push -u origin main

# Luego verifica:
echo "✅ Código en: https://github.com/MauricioPerera/ardf-sdk"
```

---

**Status**: Todo listo para push. Solo falta autenticación de GitHub.
