// eslint-disable
// this is an auto generated file. This will be overwritten

export const getPin = `query GetPin($id: ID!) {
  getPin(id: $id) {
    id
    userId
    userCognitoId
    hasImage
    eventName
    createdAt
    eventType
    startTime
    endTime
    description
    latitude
    longitude
  }
}
`;
export const listPins = `query ListPins($filter: ModelPinFilterInput, $limit: Int, $nextToken: String) {
  listPins(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      userCognitoId
      hasImage
      eventName
      createdAt
      eventType
      startTime
      endTime
      description
      latitude
      longitude
    }
    nextToken
  }
}
`;
