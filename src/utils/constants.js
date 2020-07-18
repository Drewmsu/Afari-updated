const constants = {
  user: {
    isLoggedIn: 'IS_LOGGED_IN',
    userId: 'USER_ID',
    name: 'NAME',
    role: 'ROLE',
    email: 'EMAIL',
    username: 'USERNAME',
    password: 'PASSWORD',
    lastPayment: 'LAST_PAYMENT'
  },
  building: {
    id: 'BUILDING_ID',
    name: 'BUILDING_NAME',
    apartmentId: 'APARTMENT_ID',
    apartmentName: 'APARTMENT_NAME'
  },
  laboralObligationType: {
    afp: '[AFP]',
    essalud: '[Essalud y Onp]',
    planilla: '[Presentacion planilla trabajadores]'
  },
  viewType: {
    pdf: 'PDF_VIEW',
    web: 'WEB_VIEW'
  },
  ownerType: {
    owner: 'PRO',
    tenant: 'INQ'
  }
};

export default constants;
