echo Pulling from Github
git pull git@github.com:ToddLandis/cs3220.git
echo Setting files to be executable
chmod -R 755 Project1
echo Pushing possible changes (file permissions) back to GitHub
push.sh
