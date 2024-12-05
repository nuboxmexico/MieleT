threads_count = ENV.fetch('MAX_THREADS', 5).to_i
threads threads_count, threads_count
app_dir = File.expand_path('../../', __dir__)

port ENV.fetch('PORT', 3000)

environment ENV.fetch('RAILS_ENV') { 'development' }

bind "unix://#{app_dir}/tmp/sockets/puma.sock"
pidfile "#{app_dir}/tmp/pids/puma.pid"
state_path "#{app_dir}/tmp/pids/puma.state"
stdout_redirect "#{app_dir}/log/puma.stdout.log", "#{app_dir}/log/puma.stderr.log", true

plugin :tmp_restart
