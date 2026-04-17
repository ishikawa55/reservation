# ベースイメージ
FROM node:18-alpine

# 作業ディレクトリの指定
WORKDIR /app

# 依存関係のコピーとインストール
COPY package.json package-lock.json ./
RUN npm ci

# ソースコードのコピー
COPY . .

# Next.jsのテレメトリを無効化
ENV NEXT_TELEMETRY_DISABLED 1

# ビルドと起動
RUN npm run build
EXPOSE 3000

CMD ["npm", "start"]
