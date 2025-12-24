# ---------- BUILD ----------
    FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
    WORKDIR /src
    
    # Copier UNIQUEMENT le csproj de l'API
    COPY Api/Api.csproj Api/
    RUN dotnet restore Api/Api.csproj
    
    # Copier le reste du code
    COPY . .
    
    # Publish UNIQUEMENT l'API
    RUN dotnet publish Api/Api.csproj \
        -c Release \
        -o /app/publish \
        --no-restore
    
    # ---------- RUNTIME ----------
    FROM mcr.microsoft.com/dotnet/aspnet:10.0
    WORKDIR /app
    
    COPY --from=build /app/publish .
    
    EXPOSE 8080
    ENTRYPOINT ["dotnet", "Api.dll"]
    