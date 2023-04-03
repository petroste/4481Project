# # Use Node v16 as the base image
FROM frolvlad/alpine-glibc:latest
# # Install prerequisites
RUN apk update
RUN apk add --no-cache bash
RUN apk add curl expect
# RUN bash <(curl https://raw.githubusercontent.com/ory/meta/master/install.sh) -b . ory
# RUN apk add gcompat
RUN curl https://raw.githubusercontent.com/ory/meta/master/install.sh | sh -s ory
# # RUN mv ./ory /usr/local/bin/
EXPOSE 8080
WORKDIR /app
COPY ./startup.sh ./
ENTRYPOINT ["./startup.sh"]
# CMD ["ory", "proxy", "-y", "http://localhost:3000", "https://helpdesk.sidharth.me", "--port", "8080", "--project", "zen-burnell-y0u0rxqerr", "--rewrite-host", "--allowed-cors-origins" , "https://helpdesk.sidharth.me"]
