##### Minimal sample to reproduce https://github.com/Opteo/google-ads-api/issues/328#issuecomment-942338822

###### 1. Requirements

- ts-node

```sh
npm i -g typescript ts-node
```

###### 2. Initialize the project

```sh
git clone https://github.com/jstoeffler/opteo-google-ads-api-issue-328.git
cd opteo-google-ads-api-issue-328
npm i
cp .env.sample .env
nano .env
# Add your credentials
```

###### 3. Edit the code if need (everything is in index.ts)

###### 4. Run:

```sh
ts-node index.ts
```

