export interface Project {
  id: string;
  name: string;
  source: {
    type: 'onshape';
    url: string;
  };
}
