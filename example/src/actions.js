import { generateActions } from 'no-redux';

export const api = 'https://my-json-server.typicode.com/ln613/no-redux/';

export const actionData = {
  artists: {
    url: api + 'artists'
  },
  artist: {
    url: api + 'artists/{id}',
  },
  newArtist: {
    url: api + 'artists',
    method: 'post',
    path: 'artists[]'
  }
}

export default generateActions(actionData);
