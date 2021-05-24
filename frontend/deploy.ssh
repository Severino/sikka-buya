#!/bash/bash
echo "This script will:\n1. Build the vue app.\n2. Remove existing project in 'www/html'.\n3.Copy new project to 'www/html'."
echo "1. Build frontend vue app"
npm run build
echo "2. Remove existing project"
sudo rm /var/www/html/* -r
echo "3.Copy new project"
sudo mv ~/sikka-buya/frontend/dist/* /var/www/html/
echo "Done! Thanks for deploying a new version of sikka:buya"
