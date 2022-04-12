echo "\nPulling from Github"
git pull git@github.com:ToddLandis/cs3220.git
echo "\nSetting files to be executable"
chmod -R 755 Project1 Project2 Project3 Project4 Project5 Project6 Project7
echo "\nPushing possible changes (file permissions) back to GitHub"
push.sh
