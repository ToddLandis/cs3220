echo "\nPulling from Github"
git pull git@github.com:ToddLandis/cs3220.git
echo "\nSetting files to be executable"
chmod -R 755 Project1
echo "\nPushing possible changes \(file permissions\) back to GitHub"
push.sh
