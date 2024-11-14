### Erasmo Cardoso
# Imagem base do Elasticsearch
FROM docker.elastic.co/elasticsearch/elasticsearch:8.5.3

# variáveis Elasticsearch
ENV discovery.type=single-node
ENV xpack.security.enabled=false
ENV xpack.security.http.ssl.enabled=false
ENV ELASTIC_PASSWORD=changeme

# Expor a porta 9200
EXPOSE 9200
