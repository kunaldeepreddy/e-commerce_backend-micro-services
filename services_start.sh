pm2 start App.js --name homely-haven-backend --restart-delay=3000

# Stop services
# -----------------
# pm2 delete all

# Auto restart
# -----------------
# npm install pm2-windows-startup -g
# pm2-startup install
# pm2 save

# Stop auto restart
# ------------------
# pm2 cleardump
# pm2-startup uninstall