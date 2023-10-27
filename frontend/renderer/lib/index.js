import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { useMemo } from "react";

let uri = "http://localhost:4000/graphql";
let apolloClient;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined", // Apollo 인스턴스를 서버와 클라이언트에서 구분해서 사용하도록 처리
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
  });
}

//* Apollo 클라이언트 초기화 함수
export function initApollo(initialState = null) {
  const client = apolloClient || createApolloClient();

  if (initialState) {
    client.cache.restore({
      ...client.extract(),
      ...initialState,
    });
  }

  if (typeof window === "undefined") {
    return client;
  }

  if (!apolloClient) {
    apolloClient = client;
  }

  return client;
}

export function useApollo(initialState) {
  return useMemo(() => initApollo(initialState), [initialState]);
}
