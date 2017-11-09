import { generateActions } from 'no-redux';

export const actionData = {
  artists: {
    url: 'https://ln613.github.io/no-redux/api/artists.json'
  }
}

export default generateActions(actionData);
