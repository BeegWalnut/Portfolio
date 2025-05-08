$ErrorActionPreference = "Stop"

# 0️⃣  Remove any previous output and recreate the folder
if (Test-Path .\output) { Remove-Item .\output -Recurse -Force }
New-Item -ItemType Directory -Path .\output | Out-Null

# 1️⃣  Build the Blazor project
dotnet publish .\Portfolio\Portfolio.csproj -c Release -o build

# 2️⃣  Copy the fresh static files
Copy-Item -Recurse -Force .\build\wwwroot\* .\output\

# 3️⃣  Disable Jekyll on GitHub Pages
New-Item -ItemType File -Path .\output\.nojekyll -Force | Out-Null