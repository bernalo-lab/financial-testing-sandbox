import requests, subprocess

ip = requests.get('https://api.ipify.org').text
print(f"Detected IP: {ip}")

group = input("Enter resource group: ")
server = input("Enter PostgreSQL server name: ")

subprocess.run([
  "az", "postgres", "server", "firewall-rule", "create",
  "--resource-group", group,
  "--server-name", server,
  "--name", f"Allow_{ip.replace('.', '_')}",
  "--start-ip-address", ip,
  "--end-ip-address", ip
])