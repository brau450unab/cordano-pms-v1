# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.git
    pkgs.curl
    pkgs.jq
  ];
  
  # Sets environment variables in the workspace for Google AI Studio & Gemini
  env = {
    PORT = "3000";
    NEXT_TELEMETRY_DISABLED = "1";
    NODE_ENV = "development";
    GCP_PROJECT_ID = "gen-lang-client-0862587160";
    GCP_PROJECT_NUMBER = "349577440002";
    GCP_REGION = "us-west1";
    STITCH_PROJECT_ID = "12916038623650348087";
  };
  
  idx = {
    # Search for extensions on https://open-vsx.org/
    extensions = [
      "google.gemini"
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "bradlc.vscode-tailwindcss"
    ];
    
    workspace = {
      # Runs when a workspace is first created with this dev.nix file
      onCreate = {
        npm-install = "npm install --prefer-offline --no-audit";
      };
      # Runs each time the workspace is restarted
      onStart = {
        run-dev = "npm run dev";
      };
    };
    
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
