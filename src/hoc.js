import { tap as _tap, prop, find, pipe, isNil, is, isEmpty, view, lensPath, reduce, max, last, differenceWith, anyPass } from 'ramda';
import { connect } from 'no-redux';
import { compose, lifecycle, withProps, withHandlers, withState as _withState } from 'recompose';

const firstLetterToUpper = str => str[0].toUpperCase() + str.slice(1);
const toLensPath = s => s.replace(/\[/g, '.').replace(/\]/g, '').split('.');
const viewLens = (s, o) => view(lensPath(toLensPath(s)), o);

export const withParams = withProps(props => ({ ...props.match.params }));

export const withState = (prop, val) =>
  _withState(prop, 'set' + firstLetterToUpper(prop), val);

export const withLoad = (prop, key, field, force) => lifecycle({
  componentWillMount() {
    (force || isEmpty(this.props[prop])) && this.props['get' + firstLetterToUpper(prop)]({ [key || 'id']: this.props[field || 'id'] });
  }
});
export const withLoadForce = (prop, key, field) => withLoad(prop, key, field, true);
export const withLoadBy = (prop, key, force) => withLoad(prop, key, key, force);
export const withLoadForceBy = (prop, key) => withLoad(prop, key, key, true);

export const withEdit = (prop, path, initObj) => lifecycle({
  componentWillMount() {
    const id = +this.props.match.params.id;
    const list = toLensPath(path || (prop + 's'));
    const v = find(x => x.id == id, view(lensPath(list), this.props) || []);
    this.props.setForm(v || { id, ...(initObj || {}) }, { path: prop });
  }
});

export const withEditList = prop => lifecycle({
  componentWillMount() {
    const list = toLensPath(prop);
    const v = view(lensPath(list), this.props);
    this.props.setForm(v, { path: list });
  }
});

export const withNewValue = (p, v, f) => lifecycle({
  componentWillReceiveProps(np) {
    const nv = np[p];
    const ov = this.props[p];
    if (isNil(v) ? nv !== ov : (nv === v && ov === null))
      f(this.props, nv);
  }
});

export const withSuccess = (a, f1, f2) => compose(
  connect(successSelector(a)),
  withNewValue('success', true, f1),
  withNewValue('success', false, f2),
);

const getEl = id => id ? document.getElementById(id) : window;

export const withListener = (ev, f, id) => compose(
  withHandlers({ listener: p => e => f(p) }),
  lifecycle({
    componentDidMount() {
      getEl(id).addEventListener(ev, this.props.listener);
    },

    componentWillUnmount() {
      getEl(id).removeEventListener(ev, this.props.listener);
    }
  })
)  

export const withLang = withProps(p => ({ n: name(p.lang), d: desc(p.lang) }));

export const withNewId = path => withProps(p => ({ newId: reduce(max, 0, (viewLens(path, p) || []).map(x => +x.id)) + 1 }));
