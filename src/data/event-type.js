export default {
  order: [
    'Feeding',
    'Handling',
    'Weight',
    'Shedding',
    'Maintenance',
    'Health',
    'Other',
  ],
  config: {
    'Feeding': {
      color: '#2ab058',
      calendar: 'green',
      icon: 'mdi-silverware-fork-knife',
    },
    'Handling': {
      color: '#f072f2',
      calendar: 'pink',
      icon: 'mdi-hand-heart',
    },
    'Weight': {
      color: '#ff8a36',
      calendar: 'orange',
      icon: 'mdi-weight-gram',
    },
    'Shedding': {
      color: '#ddd61d',
      calendar: 'yellow',
      icon: 'mdi-creation',
    },
    'Maintenance': {
      color: '#bb91ff',
      calendar: 'purple',
      icon: 'mdi-tools',
    },
    'Health': {
      color: '#f44e4e',
      calendar: 'red',
      icon: 'mdi-hospital-box',
    },
    'Other': {
      color: '#7dd8ff',
      calendar: 'blue',
      icon: 'mdi-information',
    },
  },
}
