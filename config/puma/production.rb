app_dir = File.expand_path('../../', __dir__)

workers ENV.fetch('PUMA_WORKERS', 2)
threads_count = ENV.fetch('MAX_THREADS', 5).to_i
threads threads_count, threads_count

port ENV.fetch('PORT', 3000)

environment ENV.fetch('RAILS_ENV') { 'development' }

bind "unix://#{app_dir}/tmp/sockets/puma.sock"
pidfile "#{app_dir}/tmp/pids/puma.pid"
state_path "#{app_dir}/tmp/pids/puma.state"
stdout_redirect "#{app_dir}/log/puma.stdout.log", "#{app_dir}/log/puma.stderr.log", true
worker_timeout 400

plugin :tmp_restart
preload_app!

on_worker_boot do
  ActiveRecord::Base.establish_connection
end
