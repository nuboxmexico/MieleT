ip = '3.139.228.239'
connect_info = "ubuntu@#{ip}"
role :app, [connect_info]
role :web, [connect_info]
role :db,  [connect_info]

# Define server(s)
set :user, 'ubuntu'
server ip, roles: %w[web]

# See the example commented out section in the file
# for more options.
set :ssh_options, {
  forward_agent: true,
  keys: ['~/.ssh/test-miele.pem'],
  user: 'ubuntu'
}
