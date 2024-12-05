ARG RUBY_VERSION=2.7.1

############################################
# builder stage
############################################

FROM ruby:${RUBY_VERSION}

USER root


############################################
# Node js + Yarn
RUN apt-get update
RUN wget https://dl.yarnpkg.com/debian/pubkey.gpg 
RUN apt-key add pubkey.gpg 
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

RUN source ~/.nvm/nvm.sh && nvm install 18 && nvm use 18

RUN apt-get update && apt-get install -y \
    yarn \
    && rm -rf /var/lib/apt/lists/*
    
# Update bundler
RUN gem install bundler -v 2.4.22 
RUN gem install foreman
############################################

############################################
# Developement dependencies stage
############################################

COPY Gemfile Gemfile.lock ./
RUN bundle config set without ''
RUN bundle config set with development test
RUN bundle install --jobs=4 --retry=3
COPY package.json .
COPY package-lock.json .
# ############################################
# ## Development stage
# ############################################

WORKDIR /usr/src

# Copy project code
COPY . .
