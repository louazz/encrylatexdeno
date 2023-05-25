FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache app.ts
RUN apt-get install -y texlive-latex-base texlive-fonts-recommended texlive-fonts-extra
RUN wget https://hackage.haskell.org/package/pandoc-1.17.0.3/pandoc-1.17.0.3.tar.gz
RUN tar xvzf pandoc-1.17.0.3.tar.gz
RUN stack setup && stack install
RUN PATH=$HOME/.local/bin:$PATH:$HOME/bin

CMD ["run", "-A", "app.ts", "--unstalble"]
