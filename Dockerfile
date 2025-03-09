FROM soajsorg/node-slim

RUN mkdir -p /opt/soajs/soajs.multitenant/node_modules/
WORKDIR /opt/soajs/soajs.multitenant/
COPY . .
RUN npm install

CMD ["/bin/bash"]