@echo off
echo =======================================================
echo DESPLIEGUE DE CORDANO PMS V1 HACIA GOOGLE CLOUD RUN
echo Proyecto: gen-lang-client-0862587160 (349577440002)
echo Region:   us-west1
echo Servicio: cordano-pms-v1 (Independiente)
echo =======================================================

echo 1. Verificando gcloud CLI...
where gcloud >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Google Cloud SDK (gcloud) no esta instalado o no esta en el PATH.
    echo Por favor instala Google Cloud SDK o utiliza Cloud Build desde Google Cloud Console.
    echo Mas detalles en README.md
    pause
    exit /b 1
)

echo 2. Configurando proyecto en gcloud...
call gcloud config set project gen-lang-client-0862587160

echo 3. Desplegando codigo fuente directamente a Cloud Run...
call gcloud run deploy cordano-pms-v1 ^
    --source . ^
    --region us-west1 ^
    --allow-unauthenticated ^
    --port 8080 ^
    --memory 512Mi ^
    --cpu 1

echo =======================================================
echo Despliegue completado con exito.
echo =======================================================
pause
