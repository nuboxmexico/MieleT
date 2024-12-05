# config valid only for current version of Capistrano
# lock "3.8.1"
SSHKit.config.command_map[:sidekiq] = "bundle exec sidekiq"
SSHKit.config.command_map[:sidekiqctl] = "bundle exec sidekiqctl"

# set :stage, 'production'
set :application, "miele_tickets"
set :repo_url, "git@bitbucket.org:garage-labs/miele-tickets.git"

# Default branch is :master
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
# set :branch, :develop

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/var/www/html/miele_tickets"
set :rvm_type, :user
set :rvm_ruby_version, "2.7.1"
set :rvm_binary, "~/.rvm/bin/rvm"
set :rvm_bin_path, "$HOME/bin"
set :default_env, {rvm_bin_path: "~/.rvm/bin"}
set :user, "ubuntu"
set :use_sudo, false
set :deploy_via, :copy

# Rails config
set :conditionally_migrate, true
set :migration_role, :web

# Default value for :format is :airbrussh.
set :format, :airbrussh

set :pty, true
set :rails_env, fetch(:stage)

set sidekiq_log: File.join(shared_path, "log", "sidekiq.log")
set :keep_releases, 1
set :keep_assets, 2
Rake::Task["deploy:assets:backup_manifest"].clear_actions
SSHKit.config.command_map[:rm] = 'sudo rm'
set :linked_dirs,
  fetch(:linked_dirs, []).push("log", "storage", "tmp/pids", "tmp/cache", "tmp/sockets", "vendor/bundle",
    "public/system", "node_modules", "tmp/pids", "tmp/sockets")

set :assets_roles, %i[web app]

branch = {
  staging: "develop",
  pre_production: "pre_production",
  production: "master"
}

namespace :deploy do
  desc "Make sure local git is in sync with remote."
  task :check_revision do
    on roles(:app) do
      branch = branch[fetch(:stage).to_sym]
      unless `git rev-parse HEAD` == `git rev-parse origin/#{branch}`
        puts "WARNING: HEAD is not the same as origin/" + branch
        puts "Run `git push` to sync changes."
        exit
      end
    end
  end

  task :add_default_hooks do
    after "deploy:starting", "sidekiq:quiet"
    after "deploy:updated", "sidekiq:stop"
    after "deploy:reverted", "sidekiq:stop"
    after "deploy:published", "sidekiq:start"
  end

  desc "Restart application"
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :bundle, "install"
        execute :chmod, "777 " + release_path.join("tmp/cache/").to_s
        execute :chmod, "777 " + release_path.join("log/").to_s
        execute :rake, "db:create RAILS_ENV=#{fetch(:stage)}"
        execute :rake, "db:migrate RAILS_ENV=#{fetch(:stage)}"
        execute "sudo systemctl restart nginx"
      end
    end

    on roles(:web), in: :sequence, wait: 5 do
      within release_path do
        # execute :bundle, 'install'
        execute :chmod, "777 " + release_path.join("tmp/cache/").to_s
        execute :chmod, "777 " + release_path.join("log/").to_s
        execute :rake, "db:create RAILS_ENV=#{fetch(:stage)}"
        execute :rake, "db:migrate RAILS_ENV=#{fetch(:stage)}"
        ##        execute :rake, "assets:precompile RAILS_ENV=#{fetch(:stage)}"
        execute 'sudo systemctl restart nginx'
        execute 'sudo systemctl restart sidekiq'
      end
    end
  end

  before :starting, :check_revision
  after :finishing, :restart
end
