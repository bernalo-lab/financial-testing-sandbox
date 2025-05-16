import subprocess, json

namespaces = [
  "Microsoft.Web", "Microsoft.DBforPostgreSQL", "Microsoft.Storage",
  "Microsoft.KeyVault", "Microsoft.Insights", "Microsoft.OperationalInsights",
  "Microsoft.ContainerService", "Microsoft.Resources"
]

print("Registering required Azure namespaces...")

for ns in namespaces:
    state = subprocess.run(["az", "provider", "show", "--namespace", ns, "--query", "registrationState", "-o", "tsv"],
                           capture_output=True, text=True).stdout.strip()
    if state == "Registered":
        print(f"✅ {ns} is already registered.")
    else:
        print(f"🔄 Registering {ns}...")
        subprocess.run(["az", "provider", "register", "--namespace", ns])