import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from '../components/shared/Icon';
import HomeScreen from '../screens/owner/home/HomeScreen';
import MaitenanceReceiptsScreen from '../screens/owner/maitenanceReceipts/MaitenanceReceiptsScreen';
import IncomeAndExpensesScreen from '../screens/shared/incomeAndExpenses/IncomesAndExpensesScreen';
import VouchersScreen from '../screens/shared/vouchers/VouchersScreen';
import NewsScreen from '../screens/shared/news/NewsScreen';
import LaboralObligationsScreen from '../screens/shared/laboralObligations/LaboralObligationsScreen';
import EquipmentCertificateScreen from '../screens/shared/equipmentCertificates/EquipmentCertificateScreen';
import MaitenanceScheduleScreen from '../screens/shared/maitenanceSchedules/MaitenanceScheduleScreen';
import AccountStatusScreen from '../screens/shared/accountStatus/AccountStatusScreen';
import EmployeeScreen from '../screens/shared/employees/EmployeeScreen';
import AdmMenuScreen from '../screens/shared/admMenu/AdmMenuScreen';
import MoreOptionsScreen from '../screens/owner/moreOptions/MoreOptionsScreen';
import SellAndRentalScreen from '../screens/owner/sellAndRental/sellAndRentalScreen';
import PdfViewScreen from '../screens/shared/pdf/PdfViewScreen';
import { headerStyles } from '../theme/shared';
import { colors } from '../theme/appTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const HomeStack = createStackNavigator(
  {
    OwnerHome: {
      screen: HomeScreen,
      navigationOptions: {
        title: 'Inicio'
      }
    },
    IncomeAndExpenses: {
      screen: IncomeAndExpensesScreen
    },
    Vouchers: {
      screen: VouchersScreen
    },
    Pdf: {
      screen: PdfViewScreen
    }
  },
  {
    initialRouteName: 'OwnerHome',
    defaultNavigationOptions: {
      ...headerStyles
    }
  }
);

const MoreOptionsStack = createStackNavigator(
  {
    MoreOptions: {
      screen: MoreOptionsScreen,
      navigationOptions: {
        title: 'Opciones'
      }
    },
    MaitenanceReceipts: {
      screen: MaitenanceReceiptsScreen,
      navigationOptions: {
        title: 'Recibos de Mantenimiento'
      }
    },
    IncomeAndExpenses: {
      screen: IncomeAndExpensesScreen
    },
    Vouchers: {
      screen: VouchersScreen
    },
    News: {
      screen: NewsScreen,
      navigationOptions: {
        title: 'Noticias'
      }
    },
    LaboralObligations: {
      screen: LaboralObligationsScreen,
      navigationOptions: {
        title: 'Obligaciones Laborales'
      }
    },
    EquipmentCertificate: {
      screen: EquipmentCertificateScreen,
      navigationOptions: {
        title: 'Certificados de Equipos'
      }
    },
    MaitenanceSchedule: {
      screen: MaitenanceScheduleScreen
    },
    AccountStatus: {
      screen: AccountStatusScreen
    },
    Employees: {
      screen: EmployeeScreen
    },
    AdmMenu: {
      screen: AdmMenuScreen
    },
    Pdf: {
      screen: PdfViewScreen
    }
  },
  {
    initialRouteName: 'MoreOptions',
    defaultNavigationOptions: {
      ...headerStyles
    }
  }
);

const SellAndRentalAStack = createStackNavigator(
  {
    SellAndRental: {
      screen: SellAndRentalScreen,
      navigationOptions: {
        title: 'Venta y Alquiler Inmuebles'
      }
    }
  },
  {
    initialRouteName: 'SellAndRental',
    defaultNavigationOptions: {
      ...headerStyles
    }
  }
);

const OwnerApp = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarLabel: 'Inicio',
        tabBarIcon: ({ tintColor }) => <Icon name="home" color={tintColor} />
      }
    },
    MoreOptions: {
      screen: MoreOptionsStack,
      navigationOptions: {
        tabBarLabel: 'Opciones',
        tabBarIcon: ({ tintColor }) => <Icon name="options" color={tintColor} />
      }
    },
    SellAndRental: {
      screen: SellAndRentalAStack,
      navigationOptions: {
        tabBarLabel: 'Venta y Alquiler',
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="office-building" size={32} color={tintColor} />
        )
      }
    }
  },
  {
    initialRouteName: 'Home',
    barStyle: {
      backgroundColor: colors.afariBlue
    },
    activeTintColor: colors.white,
    inactiveTintColor: colors.afariLightBlue
  }
);

export default OwnerApp;
