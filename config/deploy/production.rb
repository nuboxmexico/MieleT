ips = [
  "3.81.54.128",
  "23.20.181.84",
  "54.162.97.91"
]

set :user, "ubuntu"
set :rails_env, "production"

role :web, ips

set :ssh_options, {
  forward_agent: true,
  keys: ["~/.ssh/miele-tickets-prod.pem"],
  user: "ubuntu"
}
