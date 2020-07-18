//import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/admin/home/HomeScreen';
import HomeMenuScreen from '../screens/admin/home/HomeMenuScreen';
import BuildingDetailScreen from '../screens/admin/buildingDetail/BuildingDetailScreen';
import CloseFeesScreen from '../screens/admin/closeFees/CloseFeesScreen';
import MaitenanceReceiptsScreen from '../screens/admin/maitenanceReceipts/MaitenanceReceiptsScreen';
import IncomeAndExpensesScreen from '../screens/shared/incomeAndExpenses/IncomesAndExpensesScreen';
import VouchersScreen from '../screens/shared/vouchers/VouchersScreen';
import OwnerRelationScreen from '../screens/admin/owners/OwnerRelationScreen';
import NewsScreen from '../screens/shared/news/NewsScreen';
import LaboralObligationsScreen from '../screens/shared/laboralObligations/LaboralObligationsScreen';
import EquipmentCertificateScreen from '../screens/shared/equipmentCertificates/EquipmentCertificateScreen';
import MaitenanceScheduleScreen from '../screens/shared/maitenanceSchedules/MaitenanceScheduleScreen';
import AccountStatusScreen from '../screens/shared/accountStatus/AccountStatusScreen';
import EmployeeScreen from '../screens/shared/employees/EmployeeScreen';
import AdmMenuScreen from '../screens/shared/admMenu/AdmMenuScreen';
import PdfViewScreen from '../screens/shared/pdf/PdfViewScreen';
import FeesScreen from '../screens/admin/fees/FeesScreen';
import EmailScreen from '../screens/admin/email/SendEmailScreen';
//import AdminSideBar from './AdminSideBar';

import { headerStyles } from '../theme/shared';
//import { colors } from '../theme/appTheme';

const AdminApp = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    HomeMenu: {
      screen: HomeMenuScreen
    },
    BuildingDetail: {
      screen: BuildingDetailScreen
    },
    CloseFees: {
      screen: CloseFeesScreen
    },
    MaitenanceReceipts: {
      screen: MaitenanceReceiptsScreen
    },
    IncomeAndExpenses: {
      screen: IncomeAndExpensesScreen
    },
    Vouchers: {
      screen: VouchersScreen
    },
    Owners: {
      screen: OwnerRelationScreen
    },
    News: {
      screen: NewsScreen
    },
    LaboralObligations: {
      screen: LaboralObligationsScreen
    },
    EquipmentCertificate: {
      screen: EquipmentCertificateScreen
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
    },
    Fees: {
      screen: FeesScreen
    },
    Email: {
      screen: EmailScreen
    }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      ...headerStyles
    }
  }
);

// const AdminApp = createDrawerNavigator(
//   {
//     Home: HomeStack
//   },
//   {
//     drawerBackgroundColor: colors.alterBackground,
//     contentComponent: props => <AdminSideBar {...props} />
//   }
// );

export default AdminApp;
