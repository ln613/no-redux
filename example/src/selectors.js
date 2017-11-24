import { mapStateWithSelectors } from 'no-redux';

const artists = s => s.artists;
const currentArtist = s => s.currentArtist;
const error = s => s.error;
const isLoading = s => s.isLoading;

export const selector = mapStateWithSelectors({
  artists,
  currentArtist,
  error,
  isLoading
});