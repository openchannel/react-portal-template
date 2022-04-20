export const appsConfig = {
  layout: 'table',
  data: {
    pages: 30,
    pageNumber: 1,
    list: [],
    count: 30,
  },
  options: ['Edit', 'Preview', 'Submit', 'Delete'],
};

export const query = {
  $or: [
    {
      'status.value': { $in: ['inReview', 'pending', 'inDevelopment', 'rejected'] },
      'parent.status': {
        $exists: false,
      },
    },
    {
      'parent.status.value': 'approved',
      isLive: true,
    },
    {
      'parent.status.value': 'suspended',
      isLive: true,
    },
  ],
};