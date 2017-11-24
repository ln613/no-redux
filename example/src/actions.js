import { generateActions } from 'no-redux';

export const api = 'https://my-json-server.typicode.com/ln613/no-redux/';

export const actionData = {
  artists: {
    url: api + 'artists'
  },
  currentArtist: {
    url: api + 'artists/{id}',
  },
  newArtist: {
    url: api + 'artists',
    method: 'post',
    path: 'artists[]'
  },
  artist: {
    url: api + 'artists/{id}',
    methods: ['put', 'patch', 'delete'],
    path: 'artists[id]'
  },
}

export default generateActions(actionData);
