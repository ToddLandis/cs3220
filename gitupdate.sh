echo Adding Changes
git add --all
echo Committing Changes
git commit -m "Pushing from John"
echo Pushing to Github
git push git@github.com:ToddLandis/cs3220.git
echo Pulling from Github
git pull git@github.com:ToddLandis/cs3220.git
echo Setting files to be executable
chmod 755 Project1/*
