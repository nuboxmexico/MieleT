role :app, %w{ubuntu@3.140.236.228}
role :web, %w{ubuntu@3.140.236.228}
role :db,  %w{ubuntu@3.140.236.228}

# Define server(s)
set :user, "ubuntu"
server "3.140.236.228", roles: %w{web}

# See the example commented out section in the file
# for more options.
set :ssh_options, {
    forward_agent: true,
    keys: ["~/.ssh/test-miele.pem"],
    user: 'ubuntu'
}
