import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API_CONSTANT } from 'src/app/core/constant/api.constant';
import { APP_CONSTANT } from 'src/app/core/constant/app.constant';
import { MESSAGE_CONSTANT } from 'src/app/core/constant/message.constant';
import { ApiService } from 'src/app/core/services/api.services';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
})
export class TenantComponent {
  tenantCreateForm!: FormGroup;
  tenantUpdateForm!: FormGroup;
  tenantStopForm!: FormGroup;
  domains: Array<string> = ['vercado.com', 'enterprisehub.io'];
  isCreateTenant: boolean = true;
  isUpdateTenant: boolean = false;
  isStopTenant: boolean = false;
  sslCertificate: any;
  privateKey: any;
  bundle: any;
  selectedDomain: string = '';
  isRemoveConstraints: boolean = false;
  removeConstraintsForm!: FormGroup;
  addConstraintsForm!: FormGroup;
  isRestartTenant: boolean = false;
  restartTenantForm!: FormGroup;
  isBonanzaConnect: boolean = false;
  bonanzaConnectForm!: FormGroup;
  isGHL: boolean = false;
  ghlForm!: FormGroup;
  isTenantDetail: boolean = false;
  searchText: FormControl = new FormControl('', Validators.required);
  searchResult: any = {};
  isSearched: boolean = false;
  isTenantTab: boolean = true;
  countries: Array<any> = [
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Albania', code: 'AL' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'American Samoa', code: 'AS' },
    { name: 'Andorra', code: 'AD' },
    { name: 'Angola', code: 'AO' },
    { name: 'Anguilla', code: 'AI' },
    { name: 'Antarctica', code: 'AQ' },
    { name: 'Antigua and Barbuda', code: 'AG' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Aruba', code: 'AW' },
    { name: 'Australia', code: 'AU' },
    { name: 'Austria', code: 'AT' },
    { name: 'Azerbaijan', code: 'AZ' },
    { name: 'Bahamas', code: 'BS' },
    { name: 'Bahrain', code: 'BH' },
    { name: 'Bangladesh', code: 'BD' },
    { name: 'Barbados', code: 'BB' },
    { name: 'Belarus', code: 'BY' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Belize', code: 'BZ' },
    { name: 'Benin', code: 'BJ' },
    { name: 'Bermuda', code: 'BM' },
    { name: 'Bhutan', code: 'BT' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Bonaire, Sint Eustatius and Saba', code: 'BQ' },
    { name: 'Bosnia and Herzegovina', code: 'BA' },
    { name: 'Botswana', code: 'BW' },
    { name: 'Bouvet Island', code: 'BV' },
    { name: 'Brazil', code: 'BR' },
    { name: 'British Indian Ocean Territory', code: 'IO' },
    { name: 'Brunei Darussalam', code: 'BN' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Burkina Faso', code: 'BF' },
    { name: 'Burundi', code: 'BI' },
    { name: 'Cabo Verde', code: 'CV' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'Cameroon', code: 'CM' },
    { name: 'Canada', code: 'CA' },
    { name: 'Cayman Islands (the)', code: 'KY' },
    { name: 'Central African Republic (the)', code: 'CF' },
    { name: 'Chad', code: 'TD' },
    { name: 'Chile', code: 'CL' },
    { name: 'China', code: 'CN' },
    { name: 'Christmas Island', code: 'CX' },
    { name: 'Cocos (Keeling) Islands (the)', code: 'CC' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Comoros (the)', code: 'KM' },
    { name: 'Congo (the Democratic Republic of the)', code: 'CD' },
    { name: 'Congo (the)', code: 'CG' },
    { name: 'Cook Islands (the)', code: 'CK' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Croatia', code: 'HR' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Curaçao', code: 'CW' },
    { name: 'Cyprus', code: 'CY' },
    { name: 'Czechia', code: 'CZ' },
    { name: "Côte d'Ivoire", code: 'CI' },
    { name: 'Denmark', code: 'DK' },
    { name: 'Djibouti', code: 'DJ' },
    { name: 'Dominica', code: 'DM' },
    { name: 'Dominican Republic', code: 'DO' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Egypt', code: 'EG' },
    { name: 'El Salvador', code: 'SV' },
    { name: 'Equatorial Guinea', code: 'GQ' },
    { name: 'Eritrea', code: 'ER' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Eswatini', code: 'SZ' },
    { name: 'Ethiopia', code: 'ET' },
    { name: 'Falkland Islands', code: 'FK' },
    { name: 'Faroe Islands', code: 'FO' },
    { name: 'Fiji', code: 'FJ' },
    { name: 'Finland', code: 'FI' },
    { name: 'France', code: 'FR' },
    { name: 'French Guiana', code: 'GF' },
    { name: 'French Polynesia', code: 'PF' },
    { name: 'French Southern Territories', code: 'TF' },
    { name: 'Gabon', code: 'GA' },
    { name: 'Gambia', code: 'GM' },
    { name: 'Georgia', code: 'GE' },
    { name: 'Germany', code: 'DE' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Gibraltar', code: 'GI' },
    { name: 'Greece', code: 'GR' },
    { name: 'Greenland', code: 'GL' },
    { name: 'Grenada', code: 'GD' },
    { name: 'Guadeloupe', code: 'GP' },
    { name: 'Guam', code: 'GU' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Guernsey', code: 'GG' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Guinea-Bissau', code: 'GW' },
    { name: 'Guyana', code: 'GY' },
    { name: 'Haiti', code: 'HT' },
    { name: 'Heard Island and McDonald Islands', code: 'HM' },
    { name: 'Holy See (the)', code: 'VA' },
    { name: 'Honduras', code: 'HN' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Hungary', code: 'HU' },
    { name: 'Iceland', code: 'IS' },
    { name: 'India', code: 'IN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Iran (Islamic Republic of)', code: 'IR' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Isle of Man', code: 'IM' },
    { name: 'Israel', code: 'IL' },
    { name: 'Italy', code: 'IT' },
    { name: 'Jamaica', code: 'JM' },
    { name: 'Japan', code: 'JP' },
    { name: 'Jersey', code: 'JE' },
    { name: 'Jordan', code: 'JO' },
    { name: 'Kazakhstan', code: 'KZ' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Kiribati', code: 'KI' },
    { name: "Korea (the Democratic People's Republic of)", code: 'KP' },
    { name: 'Korea (the Republic of)', code: 'KR' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'Kyrgyzstan', code: 'KG' },
    { name: "Lao People's Democratic Republic (the)", code: 'LA' },
    { name: 'Latvia', code: 'LV' },
    { name: 'Lebanon', code: 'LB' },
    { name: 'Lesotho', code: 'LS' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Libya', code: 'LY' },
    { name: 'Liechtenstein', code: 'LI' },
    { name: 'Lithuania', code: 'LT' },
    { name: 'Luxembourg', code: 'LU' },
    { name: 'Macao', code: 'MO' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Malawi', code: 'MW' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Maldives', code: 'MV' },
    { name: 'Mali', code: 'ML' },
    { name: 'Malta', code: 'MT' },
    { name: 'Marshall Islands', code: 'MH' },
    { name: 'Martinique', code: 'MQ' },
    { name: 'Mauritania', code: 'MR' },
    { name: 'Mauritius', code: 'MU' },
    { name: 'Mayotte', code: 'YT' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Micronesia (Federated States of)', code: 'FM' },
    { name: 'Moldova (the Republic of)', code: 'MD' },
    { name: 'Monaco', code: 'MC' },
    { name: 'Mongolia', code: 'MN' },
    { name: 'Montenegro', code: 'ME' },
    { name: 'Montserrat', code: 'MS' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Nauru', code: 'NR' },
    { name: 'Nepal', code: 'NP' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'New Caledonia', code: 'NC' },
    { name: 'New Zealand', code: 'NZ' },
    { name: 'Nicaragua', code: 'NI' },
    { name: 'Niger', code: 'NE' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Niue', code: 'NU' },
    { name: 'Norfolk Island', code: 'NF' },
    { name: 'Northern Mariana Islands', code: 'MP' },
    { name: 'Norway', code: 'NO' },
    { name: 'Oman', code: 'OM' },
    { name: 'Pakistan', code: 'PK' },
    { name: 'Palau', code: 'PW' },
    { name: 'Palestine, State of', code: 'PS' },
    { name: 'Panama', code: 'PA' },
    { name: 'Papua New Guinea', code: 'PG' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Peru', code: 'PE' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Pitcairn', code: 'PN' },
    { name: 'Poland', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Puerto Rico', code: 'PR' },
    { name: 'Qatar', code: 'QA' },
    { name: 'Republic of North Macedonia', code: 'MK' },
    { name: 'Romania', code: 'RO' },
    { name: 'Russian Federation', code: 'RU' },
    { name: 'Rwanda', code: 'RW' },
    { name: 'Réunion', code: 'RE' },
    { name: 'Saint Barthélemy', code: 'BL' },
    { name: 'Saint Helena, Ascension and Tristan da Cunha', code: 'SH' },
    { name: 'Saint Kitts and Nevis', code: 'KN' },
    { name: 'Saint Lucia', code: 'LC' },
    { name: 'Saint Martin (French part)', code: 'MF' },
    { name: 'Saint Pierre and Miquelon', code: 'PM' },
    { name: 'Saint Vincent and the Grenadines', code: 'VC' },
    { name: 'Samoa', code: 'WS' },
    { name: 'San Marino', code: 'SM' },
    { name: 'Sao Tome and Principe', code: 'ST' },
    { name: 'Saudi Arabia', code: 'SA' },
    { name: 'Senegal', code: 'SN' },
    { name: 'Serbia', code: 'RS' },
    { name: 'Seychelles', code: 'SC' },
    { name: 'Sierra Leone', code: 'SL' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Sint Maarten (Dutch part)', code: 'SX' },
    { name: 'Slovakia', code: 'SK' },
    { name: 'Slovenia', code: 'SI' },
    { name: 'Solomon Islands', code: 'SB' },
    { name: 'Somalia', code: 'SO' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
    { name: 'South Sudan', code: 'SS' },
    { name: 'Spain', code: 'ES' },
    { name: 'Sri Lanka', code: 'LK' },
    { name: 'Sudan', code: 'SD' },
    { name: 'Suriname', code: 'SR' },
    { name: 'Svalbard and Jan Mayen', code: 'SJ' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Syrian Arab Republic', code: 'SY' },
    { name: 'Taiwan (Province of China)', code: 'TW' },
    { name: 'Tajikistan', code: 'TJ' },
    { name: 'Tanzania, United Republic of', code: 'TZ' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Timor-Leste', code: 'TL' },
    { name: 'Togo', code: 'TG' },
    { name: 'Tokelau', code: 'TK' },
    { name: 'Tonga', code: 'TO' },
    { name: 'Trinidad and Tobago', code: 'TT' },
    { name: 'Tunisia', code: 'TN' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Turkmenistan', code: 'TM' },
    { name: 'Turks and Caicos Islands (the)', code: 'TC' },
    { name: 'Tuvalu', code: 'TV' },
    { name: 'Uganda', code: 'UG' },
    { name: 'Ukraine', code: 'UA' },
    { name: 'United Arab Emirates', code: 'AE' },
    {
      name: 'United Kingdom of Great Britain and Northern Ireland',
      code: 'GB',
    },
    { name: 'United States Minor Outlying Islands', code: 'UM' },
    { name: 'United States of America', code: 'US' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'Uzbekistan', code: 'UZ' },
    { name: 'Vanuatu', code: 'VU' },
    { name: 'Venezuela (Bolivarian Republic of)', code: 'VE' },
    { name: 'Viet Nam', code: 'VN' },
    { name: 'Virgin Islands (British)', code: 'VG' },
    { name: 'Virgin Islands (U.S.)', code: 'VI' },
    { name: 'Wallis and Futuna', code: 'WF' },
    { name: 'Western Sahara', code: 'EH' },
    { name: 'Yemen', code: 'YE' },
    { name: 'Zambia', code: 'ZM' },
    { name: 'Zimbabwe', code: 'ZW' },
  ];
  bankeloInfoForm!: FormGroup;
  sides: any[] = [
    {
      label: 'Sender',
      value: 'Debtor',
    },
    {
      label: 'Receiver',
      value: 'Creditor',
    },
  ];
  isbankelo: boolean = false;
  organizationTypes: any[] = [
    {
      label: 'Sole proprietorship',
      value: 'C001',
    },
    {
      label: 'Partnership',
      value: 'C002',
    },
    {
      label: 'LLC',
      value: 'C003',
    },
    {
      label: 'S Corp',
      value: 'C004',
    },
    {
      label: 'C Corp',
      value: 'C005',
    },
    {
      label: 'Nonprofit',
      value: 'C006',
    },
    {
      label: 'Government',
      value: 'C007',
    },
    {
      label: 'Others',
      value: 'C099',
    },
  ];
  lineOfBusinessCodes: any[] = [
    {
      label: 'Arts and Antiques',
      value: 'L100',
    },
    {
      label: 'Agriculture / Forestry / Fishing / Horticulture',
      value: 'L101',
    },
    {
      label: 'Audio and Video Equipment',
      value: 'L102',
    },
    {
      label: 'Automotive',
      value: 'L103',
    },
    {
      label: 'Bank / Credit Union',
      value: 'L104',
    },
    {
      label: 'Biotechnology / Life Sciences / Pharmaceutical',
      value: 'L105',
    },
    {
      label: 'Bookseller',
      value: 'L106',
    },
    {
      label: 'Building / Construction',
      value: 'L107',
    },
    {
      label: 'Casinos / Other Wagering Institutions',
      value: 'L108',
    },
    {
      label: 'Clothing / Textile and Footwear',
      value: 'L109',
    },
    {
      label: 'Consulting / Professional Services',
      value: 'L110',
    },
    {
      label: 'Cryptocurrency',
      value: 'L111',
    },
    {
      label: 'E-Cigarettes / Tobacco / Vape',
      value: 'L112',
    },
    {
      label: 'Energy / Chemical / Fuels',
      value: 'L113',
    },
    {
      label: 'Engineering',
      value: 'L114',
    },
    {
      label: 'Entertainment',
      value: 'L115',
    },
    {
      label: 'Financial and Corporate Services',
      value: 'L117',
    },
    {
      label: 'Food and Beverage',
      value: 'L118',
    },
    {
      label: 'Freight Forwarder / Marine Services / Ship Management ',
      value: 'L119',
    },
    {
      label: 'Giftware / Seasonal Products',
      value: 'L120',
    },
    {
      label:
        'Government / Public Services (including Embassies / Diplomats / Consulates)',
      value: 'L121',
    },
    {
      label: 'High Tech / Software / Telecommunications',
      value: 'L122',
    },
    {
      label: 'Hospitality',
      value: 'L123',
    },
    {
      label: 'Household Goods / Furniture',
      value: 'L124',
    },
    {
      label: 'Human Resource (HR) Services',
      value: 'L125',
    },
    {
      label: 'Industrial Equipment / Tooling / Machinery',
      value: 'L130',
    },
    {
      label:
        'Information Technology (IT) (data security / disaster recovery / software)',
      value: 'L131',
    },
    {
      label: 'Insurance',
      value: 'L132',
    },
    {
      label: 'Jewelry / Accessories / Optical',
      value: 'L133',
    },
    {
      label: 'Law Firm / Attorney',
      value: 'L134',
    },
    {
      label: 'Manufacturing',
      value: 'L135',
    },
    {
      label: 'Marketing Services',
      value: 'L136',
    },
    {
      label: 'Media / Publishing',
      value: 'L137',
    },
    {
      label: 'Medical / Healthcare',
      value: 'L138',
    },
    { label: 'Medical Tourism', value: 'L139' },
    {
      label: 'Mining',
      value: 'L140',
    },
    {
      label: 'Money Service Business (including payment services)',
      value: 'L141',
    },
    {
      label: 'Non-Profit / Charity / Non-Government Organisation (NGO)',
      value: 'L142',
    },
    {
      label: 'Online Retail / e-Commerce',
      value: 'L143',
    },
    {
      label: 'Payroll',
      value: 'L144',
    },
    {
      label: 'Pension',
      value: 'L145',
    },
    {
      label: 'Personal Care Products',
      value: 'L146',
    },
    {
      label: 'Photography',
      value: 'L147',
    },
    {
      label: 'Real Estate / Property (including rental and leasing)',
      value: 'L148',
    },
    {
      label: 'Recreational Activities',
      value: 'L149',
    },
    {
      label: 'Religious Organisation',
      value: 'L150',
    },
    {
      label: 'Retail / Services',
      value: 'L151',
    },
    {
      label: 'Security / Safety',
      value: 'L152',
    },
    {
      label: 'Sporting Goods / Recreational Products',
      value: 'L153',
    },
    {
      label: 'Transport (air / land / sea)',
      value: 'L154',
    },
    {
      label: 'Travel / Tourism',
      value: 'L155',
    },
    {
      label: 'University / Education',
      value: 'L156',
    },
    {
      label: 'Utilities (including water)',
      value: 'L157',
    },
    {
      label: 'Waste Management',
      value: 'L158',
    },
    {
      label: 'Wine / Liquor',
      value: 'L159',
    },
    {
      label: 'Tech Support',
      value: 'L180',
    },
    {
      label: 'Other',
      value: 'L199',
    },
  ];
  countryCodes: any[] = [
    {
      label: 'Afghanistan',
      value: 'AF',
      valueWithPrefix: '93',
    },
    {
      label: 'Albania',
      value: 'AL',
      valueWithPrefix: '355',
    },
    {
      label: 'Algeria',
      value: 'DZ',
      valueWithPrefix: '213',
    },
    {
      label: 'merican Samoa',
      value: 'AS',
      valueWithPrefix: '1-684',
    },
    {
      label: 'Andorra',
      value: 'AD',
      valueWithPrefix: '376',
    },
    {
      label: 'Angola',
      value: 'AO',
      valueWithPrefix: '244',
    },
    {
      label: 'Anguilla',
      value: 'AI',
      valueWithPrefix: '1-264',
    },
    {
      label: 'Antigua And Barbuda',
      value: 'AG',
      valueWithPrefix: '1-268',
    },
    {
      label: 'Argentina',
      value: 'AR',
      valueWithPrefix: '54',
    },
    {
      label: 'Armenia',
      value: 'AM',
      valueWithPrefix: '374',
    },
    {
      label: 'Aruba',
      value: 'AM',
      valueWithPrefix: '297',
    },
    {
      label: 'Australia',
      value: 'AU',
      valueWithPrefix: '61',
    },
    {
      label: 'Austria',
      value: 'AT',
      valueWithPrefix: '43',
    },
    {
      label: 'Azerbaijan',
      value: 'AZ',
      valueWithPrefix: '994',
    },
    {
      label: 'Bahamas',
      value: 'BS',
      valueWithPrefix: '1-242',
    },
    {
      label: 'Bahrain',
      value: 'BH',
      valueWithPrefix: '973',
    },
    {
      label: 'Bangladesh',
      value: 'BD',
      valueWithPrefix: '880',
    },
    {
      label: 'Barbados',
      value: 'BB',
      valueWithPrefix: '1-246',
    },
    {
      label: 'Belarus',
      value: 'BY',
      valueWithPrefix: '375',
    },
    {
      label: 'Belgium',
      value: 'BE',
      valueWithPrefix: '32',
    },
    {
      label: 'Belize',
      value: 'BZ',
      valueWithPrefix: '501',
    },
    {
      label: 'Benin',
      value: 'BJ',
      valueWithPrefix: '229',
    },
    {
      label: 'Bermuda',
      value: 'BM',
      valueWithPrefix: '1-441',
    },
    {
      label: 'Bhutan',
      value: 'BT',
      valueWithPrefix: '975',
    },
    {
      label: 'Bolivia (Plurinational State Of)',
      value: 'BO',
      valueWithPrefix: '591',
    },
    {
      label: 'Bonaire, Sint Eustatius And Saba',
      value: 'BQ',
      valueWithPrefix: '599',
    },
    {
      label: 'Bosnia And Herzegovina',
      value: 'BA',
      valueWithPrefix: '387',
    },
    {
      label: 'Botswana',
      value: 'BW',
      valueWithPrefix: '267',
    },
    {
      label: 'Bouvet Island',
      value: 'BV',
      valueWithPrefix: '47',
    },
    {
      label: 'Brazil',
      value: 'BR',
      valueWithPrefix: '55',
    },
    {
      label: 'British Indian Ocean Territory',
      value: 'IO',
      valueWithPrefix: '246',
    },
    {
      label: 'Brunei Darussalam',
      value: 'BN',
      valueWithPrefix: '673',
    },
    {
      label: 'Bulgaria',
      value: 'BG',
      valueWithPrefix: '359',
    },
    {
      label: 'Burkina Faso',
      value: 'BF',
      valueWithPrefix: '226',
    },
    {
      label: 'Burundi',
      value: 'BI',
      valueWithPrefix: '257',
    },
    {
      label: 'Cabo Verde',
      value: 'CV',
      valueWithPrefix: '238',
    },
    {
      label: 'Cambodia',
      value: 'KH',
      valueWithPrefix: '855',
    },
    {
      label: 'Cameroon',
      value: 'CM',
      valueWithPrefix: '237',
    },
    {
      label: 'Canada',
      value: 'CA',
      valueWithPrefix: '1',
    },
    {
      label: 'Curaçao',
      value: 'CW',
      valueWithPrefix: '599',
    },
    {
      label: 'Cyprus',
      value: 'CY',
      valueWithPrefix: '357',
    },
    {
      label: 'Czechia',
      value: 'CZ',
      valueWithPrefix: '420',
    },
    {
      label: 'Côte D"Ivoire',
      value: 'CI',
      valueWithPrefix: '225',
    },
    {
      label: 'Denmark',
      value: 'DK',
      valueWithPrefix: '45',
    },
    {
      label: 'Djibouti',
      value: 'DJ',
      valueWithPrefix: '253',
    },
    {
      label: 'Dominica',
      value: 'DM',
      valueWithPrefix: '1-767',
    },
    {
      label: 'Dominican Republic',
      value: 'DO',
      valueWithPrefix: '1-809,1-829,1-849',
    },
    {
      label: 'Ecuador',
      value: 'EC',
      valueWithPrefix: '593',
    },
    {
      label: 'Egypt',
      value: 'EG',
      valueWithPrefix: '20',
    },
    {
      label: 'El Salvador',
      value: 'SV',
      valueWithPrefix: '503',
    },
    {
      label: 'Equatorial Guinea',
      value: 'GQ',
      valueWithPrefix: '240',
    },
    {
      label: 'Eritrea',
      value: 'ER',
      valueWithPrefix: '291',
    },
    {
      label: 'EE',
      value: 'Estonia',
      valueWithPrefix: '372',
    },
    {
      label: 'Ethiopia',
      value: 'ET',
      valueWithPrefix: '251',
    },
    {
      label: 'European Union',
      value: 'EU',
      valueWithPrefix: '',
    },
    {
      label: 'Faroe Islands',
      value: 'FO',
      valueWithPrefix: '298',
    },
    {
      label: 'Fiji',
      value: 'FJ',
      valueWithPrefix: '679',
    },
    {
      label: 'Finland',
      value: 'FI',
      valueWithPrefix: '358',
    },
    {
      label: 'France',
      value: 'FR',
      valueWithPrefix: '33',
    },
    {
      label: 'French Guiana',
      value: 'GF',
      valueWithPrefix: '594',
    },
    {
      label: 'French Polynesia',
      value: 'PF',
      valueWithPrefix: '689',
    },
    {
      label: 'French Southern Territories',
      value: 'TF',
      valueWithPrefix: '262',
    },
    {
      label: 'Guyana',
      value: 'GY',
      valueWithPrefix: '592',
    },
    {
      label: 'Haiti',
      value: 'HT',
      valueWithPrefix: '509',
    },
    {
      label: 'Heard Island And Mcdonald Islands',
      value: 'HM',
      valueWithPrefix: '672',
    },
    {
      label: 'Holy See',
      value: 'VA',
      valueWithPrefix: '39-06',
    },
    {
      label: 'Honduras',
      value: 'HN',
      valueWithPrefix: '504',
    },
    {
      label: 'Hong Kong',
      value: 'HK',
      valueWithPrefix: '852',
    },
    {
      label: 'Hungary',
      value: 'HU',
      valueWithPrefix: '36',
    },
    {
      label: 'Iceland',
      value: 'IS',
      valueWithPrefix: '354',
    },
    {
      label: 'India',
      value: 'IN',
      valueWithPrefix: '91',
    },
    {
      label: 'Indonesia',
      value: 'ID',
      valueWithPrefix: '62',
    },
    {
      label: 'Iran (Islamic Republic Of)',
      value: 'IR',
      valueWithPrefix: '98',
    },
    {
      label: 'Iraq',
      value: 'IQ',
      valueWithPrefix: '964',
    },
    {
      label: 'Ireland',
      value: 'IE',
      valueWithPrefix: '353',
    },
    {
      label: 'Isle Of Man',
      value: 'IM',
      valueWithPrefix: '44',
    },
    {
      label: 'Israel',
      value: 'IL',
      valueWithPrefix: '972',
    },
    {
      label: 'Italy',
      value: 'IT',
      valueWithPrefix: '39',
    },
    {
      label: 'Jamaica',
      value: 'JM',
      valueWithPrefix: '1-876',
    },
    {
      label: 'Japan',
      value: 'JP',
      valueWithPrefix: '81',
    },
    {
      label: 'Jersey',
      value: 'JE',
      valueWithPrefix: '44',
    },
    {
      label: 'Jordan',
      value: 'JO',
      valueWithPrefix: '962',
    },
    {
      label: 'Kazakhstan',
      value: 'KZ',
      valueWithPrefix: '7',
    },
    {
      label: 'Kenya',
      value: 'KE',
      valueWithPrefix: '254',
    },
    {
      label: 'Kiribati',
      value: 'KI',
      valueWithPrefix: '686',
    },
    {
      label: 'Madagascar',
      value: 'MG',
      valueWithPrefix: '261',
    },
    {
      label: 'Malawi',
      value: 'MW',
      valueWithPrefix: '265',
    },
    {
      label: 'Malaysia',
      value: 'MY',
      valueWithPrefix: '60',
    },
    {
      label: 'Maldives',
      value: 'MV',
      valueWithPrefix: '960',
    },
    {
      label: 'Mali',
      value: 'ML',
      valueWithPrefix: '223',
    },
    {
      label: 'Malta',
      value: 'MT',
      valueWithPrefix: '356',
    },
    {
      label: 'Marshall Islands',
      value: 'MH',
      valueWithPrefix: '692',
    },
    {
      label: 'Martinique',
      value: 'MQ',
      valueWithPrefix: '596',
    },
    {
      label: 'Martinique',
      value: 'MR',
      valueWithPrefix: '222',
    },
    {
      label: 'Mauritius',
      value: 'MU',
      valueWithPrefix: '230',
    },
    {
      label: 'Mayotte',
      value: 'YT',
      valueWithPrefix: '262',
    },
    {
      label: 'Mexico',
      value: 'MX',
      valueWithPrefix: '52',
    },
    {
      label: 'Micronesia (Federated States Of)',
      value: 'FM',
      valueWithPrefix: '691',
    },
    {
      label: 'Moldova (The Republic Of)',
      value: 'MD',
      valueWithPrefix: '373',
    },
    {
      label: 'Monaco',
      value: 'MC',
      valueWithPrefix: '377',
    },
    {
      label: 'Mongolia',
      value: 'MN',
      valueWithPrefix: '976',
    },
    {
      label: 'Montenegro',
      value: 'ME',
      valueWithPrefix: '382',
    },

    {
      label: 'Montserrat',
      value: 'MS',
      valueWithPrefix: '1-664',
    },

    {
      label: 'Morocco',
      value: 'MA',
      valueWithPrefix: '212',
    },

    {
      label: 'Mozambique',
      value: 'MZ',
      valueWithPrefix: '258',
    },

    {
      label: 'Myanmar',
      value: 'MM',
      valueWithPrefix: '95',
    },

    {
      label: 'Namibia',
      value: 'NA',
      valueWithPrefix: '264',
    },

    {
      label: 'Nauru',
      value: 'NR',
      valueWithPrefix: '674',
    },
    {
      label: 'Papua New Guinea',
      value: 'PG',
      valueWithPrefix: '675',
    },
    {
      label: 'Paraguay',
      value: 'PY',
      valueWithPrefix: '595',
    },
    {
      label: 'Peru',
      value: 'PE',
      valueWithPrefix: '51',
    },
    {
      label: 'Philippines',
      value: 'PH',
      valueWithPrefix: '63',
    },
    {
      label: 'Pitcairn',
      value: 'PN',
      valueWithPrefix: '870',
    },
    {
      label: 'Poland',
      value: 'PL',
      valueWithPrefix: '48',
    },
    {
      label: 'Portugal',
      value: 'PT',
      valueWithPrefix: '351',
    },
    {
      label: 'Puerto Rico',
      value: 'PR',
      valueWithPrefix: '1',
    },
    {
      label: 'Qatar',
      value: 'QA',
      valueWithPrefix: '974',
    },
    {
      label: 'Romania',
      value: 'RO',
      valueWithPrefix: '40',
    },
    {
      label: 'Russian Federation',
      value: 'RU',
      valueWithPrefix: '7',
    },
    {
      label: 'Rwanda',
      value: 'RW',
      valueWithPrefix: '250',
    },
    {
      label: 'Réunion',
      value: 'RE',
      valueWithPrefix: '262',
    },
    {
      label: 'Saint Barthélemy',
      value: 'BL',
      valueWithPrefix: '590',
    },
    {
      label: 'Saint Helena, Ascension And Tristan Da Cunha',
      value: 'SH',
      valueWithPrefix: '290',
    },
    {
      label: 'Saint Kitts And Nevis',
      value: 'KN',
      valueWithPrefix: '1-869',
    },
    {
      label: 'Saint Lucia',
      value: 'LC',
      valueWithPrefix: '1-758',
    },
    {
      label: 'Saint Martin (French Part)',
      value: 'MF',
      valueWithPrefix: '590',
    },
    {
      label: 'Saint Pierre And Miquelon',
      value: 'PM',
      valueWithPrefix: '508',
    },
    {
      label: 'Saint Vincent And The Grenadines',
      value: 'VC',
      valueWithPrefix: '1-784',
    },
    {
      label: 'Samoa',
      value: 'WS',
      valueWithPrefix: '685',
    },
    {
      label: 'San Marino',
      value: 'SM',
      valueWithPrefix: '378',
    },
    {
      label: 'Sao Tome And Principe',
      value: 'ST',
      valueWithPrefix: '239',
    },
    {
      label: 'Saudi Arabia',
      value: 'SA',
      valueWithPrefix: '966',
    },
    {
      label: 'Senegal',
      value: 'SN',
      valueWithPrefix: '221',
    },
    {
      label: 'Serbia',
      value: 'RS',
      valueWithPrefix: '381',
    },
    {
      label: 'Seychelles',
      value: 'SC',
      valueWithPrefix: '248',
    },
    {
      label: 'Sierra Leone',
      value: 'SL',
      valueWithPrefix: '232',
    },
    {
      label: 'Singapore',
      value: 'SG',
      valueWithPrefix: '65',
    },
    {
      label: 'Sint Maarten (Dutch Part)',
      value: 'SX',
      valueWithPrefix: '1-721',
    },
    {
      label: 'Slovakia',
      value: 'SK',
      valueWithPrefix: '421',
    },
    {
      label: 'Slovenia',
      value: 'SI',
      valueWithPrefix: '386',
    },
    {
      label: 'Solomon Islands',
      value: 'SB',
      valueWithPrefix: '677',
    },
    {
      label: 'Somalia',
      value: 'SO',
      valueWithPrefix: '252',
    },
    {
      label: 'South Africa',
      value: 'ZA',
      valueWithPrefix: '27',
    },
    {
      label: 'South Sudan',
      value: 'SS',
      valueWithPrefix: '211',
    },
    {
      label: 'Spain',
      value: 'ES',
      valueWithPrefix: '34',
    },
    {
      label: 'Sri Lanka',
      value: 'LK',
      valueWithPrefix: '94',
    },
    {
      label: 'Sudan',
      value: 'SD',
      valueWithPrefix: '249',
    },
    {
      label: 'Suriname',
      value: 'SR',
      valueWithPrefix: '597',
    },
    {
      label: 'Svalbard And Jan Mayen',
      value: 'SJ',
      valueWithPrefix: '47',
    },
    {
      label: 'Swaziland',
      value: 'SZ',
      valueWithPrefix: '268',
    },
    {
      label: 'Sweden',
      value: 'SE',
      valueWithPrefix: '46',
    },
    {
      label: 'Switzerland',
      value: 'CH',
      valueWithPrefix: '41',
    },
    {
      label: 'Syrian Arab Republic',
      value: 'SY',
      valueWithPrefix: '963',
    },
    {
      label: 'Taiwan',
      value: 'TW',
      valueWithPrefix: '886',
    },
    {
      label: 'Tajikistan',
      value: 'TJ',
      valueWithPrefix: '992',
    },
    {
      label: 'Tanzania, United Republic Of',
      value: 'TZ',
      valueWithPrefix: '55',
    },
    {
      label: 'Thailand',
      value: 'TH',
      valueWithPrefix: '66',
    },
    {
      label: 'Timor-Leste',
      value: 'TL',
      valueWithPrefix: '670',
    },
    {
      label: 'Togo',
      value: 'TG',
      valueWithPrefix: '228',
    },
    {
      label: 'Tokelau',
      value: 'TK',
      valueWithPrefix: '690',
    },
    {
      label: 'Tonga',
      value: 'TO',
      valueWithPrefix: '676',
    },
    {
      label: 'Trinidad And Tobago',
      value: 'TT',
      valueWithPrefix: '1-868',
    },
    {
      label: 'Tunisia',
      value: 'TN',
      valueWithPrefix: '216',
    },
    {
      label: 'Turkey',
      value: 'TR',
      valueWithPrefix: '90',
    },
    {
      label: 'Turkmenistan',
      value: 'TM',
      valueWithPrefix: '993',
    },
    {
      label: 'Turks And Caicos Islands',
      value: 'TC',
      valueWithPrefix: '1-649',
    },
    {
      label: 'Tuvalu',
      value: 'TV',
      valueWithPrefix: '688',
    },
    {
      label: 'Uganda',
      value: 'UG',
      valueWithPrefix: '256',
    },
    {
      label: 'Ukraine',
      value: 'UA',
      valueWithPrefix: '380',
    },
    {
      label: 'United Arab Emirates',
      value: 'AE',
      valueWithPrefix: '971',
    },
    {
      label: 'United Kingdom',
      value: 'UK',
      valueWithPrefix: '44',
    },
    {
      label: 'United Kingdom Of Great Britain And Northern Ireland',
      value: 'GB',
      valueWithPrefix: '44',
    },
    {
      label: 'United States Minor Outlying Islands',
      value: 'UM',
      valueWithPrefix: 'Null',
    },
    {
      label: 'United States Of America',
      value: 'US',
      valueWithPrefix: '1',
    },
    {
      label: 'Uruguay',
      value: 'UY',
      valueWithPrefix: '598',
    },
    {
      label: 'Uzbekistan',
      value: 'UZ',
      valueWithPrefix: '998',
    },
    {
      label: 'Vanuatu',
      value: 'VU',
      valueWithPrefix: '678',
    },
    {
      label: 'Venezuela (Bolivarian Republic Of)',
      value: '',
      valueWithPrefix: '58',
    },
    {
      label: 'Viet Nam',
      value: 'VN',
      valueWithPrefix: '84',
    },
    {
      label: 'Virgin Islands (British)',
      value: 'VG',
      valueWithPrefix: '1-284',
    },
    {
      label: 'Virgin Islands (U.S.)',
      value: 'VI',
      valueWithPrefix: '1-340',
    },
    {
      label: 'Wallis And Futuna',
      value: 'WF',
      valueWithPrefix: '681',
    },
    {
      label: 'Western Sahara',
      value: 'EH',
      valueWithPrefix: '212',
    },
    {
      label: 'Yemen',
      value: 'YE',
      valueWithPrefix: '967',
    },
    {
      label: 'Zambia',
      value: 'ZM',
      valueWithPrefix: '260',
    },
    {
      label: 'Zimbabwe',
      value: 'ZW',
      valueWithPrefix: '263',
    },
    {
      label: 'Åland Islands',
      value: 'AX',
      valueWithPrefix: '358',
    },
  ];

  currencyCodes: any[] = [
    {
      label: 'Afghani',
      value: 'AFN',
    },
    {
      label: 'Algerian Dinar',
      value: 'DZD',
    },
    {
      label: 'Argentine Peso',
      value: 'ARS',
    },
    {
      label: 'Armenian Dram',
      value: 'AMD',
    },
    {
      label: 'Aruban Florin',
      value: 'AWG',
    },
    {
      label: 'Australian Dollar',
      value: 'AUD',
    },
    {
      label: 'Azerbaijan Manat',
      value: 'AZN',
    },
    {
      label: 'Bahamian Dollar',
      value: 'BSD',
    },
    {
      label: 'Bahraini Dinar',
      value: 'BHD',
    },
    {
      label: 'Baht',
      value: 'THB',
    },
    {
      label: 'Balboa,US Dollar',
      value: 'PAB',
    },
    {
      label: 'Bangladesh Taka',
      value: 'BDT',
    },
    {
      label: 'Barbados Dollar',
      value: 'BBD',
    },
    {
      label: 'Belarusian Ruble',
      value: 'BYN',
    },
    {
      label: 'Belize Dollar',
      value: 'BZD',
    },
    {
      label: 'Bermudian Dollar',
      value: 'BMD',
    },
    {
      label: 'Boliviano',
      value: 'BOB',
    },
    {
      label: 'Bolívar',
      value: 'VEF',
    },
    {
      label: 'Brazilian Real',
      value: 'BRL',
    },
    {
      label: 'Brunei Dollar',
      value: 'BND',
    },
    {
      label: 'Bulgarian Lev',
      value: 'BGN',
    },
    {
      label: 'Burundi Franc',
      value: 'BIF',
    },
    {
      label: 'CFA Franc BCEAO',
      value: 'XOF',
    },
    {
      label: 'CFA Franc BEAC',
      value: 'XAF',
    },
    {
      label: 'CFP Franc',
      value: 'XPF',
    },
    {
      label: 'Canadian Dollar',
      value: 'CAD',
    },
    {
      label: 'Cayman Islands Dollar',
      value: 'KYD',
    },
    {
      label: 'Chilean Peso',
      value: 'CLP',
    },
    {
      label: 'China Yuan Renminbi',
      value: 'CNY',
    },
    {
      label: 'Colombian Peso',
      value: 'COP',
    },
    {
      label: 'Comorian Franc',
      value: 'KMF',
    },
    {
      label: 'Congolese Franc',
      value: 'CDF',
    },
    {
      label: 'Convertible Mark',
      value: 'BAM',
    },
    {
      label: 'Cordoba Oro',
      value: 'NIO',
    },
    {
      label: 'Costa Rican Colon',
      value: 'CRC',
    },
    {
      label: 'Cuban Peso',
      value: 'CUP',
    },
    {
      label: 'Czech Koruna',
      value: 'CZK',
    },
    {
      label: 'Dalasi',
      value: 'GMD',
    },
    {
      label: 'Danish Krone',
      value: 'DKK',
    },
    {
      label: 'Denar',
      value: 'MKD',
    },
    {
      label: 'Djibouti Franc',
      value: 'DJF',
    },
    {
      label: 'Dominican Peso',
      value: 'DOP',
    },
    {
      label: 'Dong',
      value: 'VND',
    },
    {
      label: 'East Caribbean Dollar',
      value: 'XCD',
    },
    {
      label: 'Egyptian Pound',
      value: 'EGP',
    },
    {
      label: 'El Salvador Colon,US Dollar',
      value: 'SVC',
    },
    {
      label: 'Ethiopian Birr',
      value: 'ETB',
    },
    {
      label: 'Fiji Dollar',
      value: 'FJD',
    },
    {
      label: 'Forint',
      value: 'HUF',
    },
    {
      label: 'Ghana Cedi',
      value: 'GHS',
    },
    {
      label: 'Gibraltar Pound',
      value: 'GIP',
    },
    {
      label: 'Gourde,US Dollar',
      value: 'HTG',
    },
    {
      label: 'Guarani',
      value: 'PYG',
    },
    {
      label: 'Guinean Franc',
      value: 'GNF',
    },
    {
      label: 'Guyana Dollar',
      value: 'GYD',
    },
    {
      label: 'Hong Kong Dollar',
      value: 'HKD',
    },
    {
      label: 'Hryvnia',
      value: 'UAH',
    },
    {
      label: 'Iceland Krona',
      value: 'ISK',
    },
    {
      label: 'India Rupee',
      value: 'INR',
    },
    {
      label: 'Iranian Rial',
      value: 'IRR',
    },
    {
      label: 'Iraqi Dinar',
      value: 'IQD',
    },
    {
      label: 'Jamaican Dollar',
      value: 'JMD',
    },
    {
      label: 'Jordanian Dinar',
      value: 'JOD',
    },
    {
      label: 'Kenyan Shilling',
      value: 'KES',
    },
    {
      label: 'Kina',
      value: 'PGK',
    },
    {
      label: 'Kuna',
      value: 'HRK',
    },
    {
      label: 'Kuwaiti Dinar',
      value: 'KWD',
    },
    {
      label: 'Kwanza',
      value: 'AOA',
    },
    {
      label: 'Kyat',
      value: 'MMK',
    },
    {
      label: 'Lao Kip',
      value: 'LAK',
    },
    {
      label: 'Lari',
      value: 'GEL',
    },
    {
      label: 'Lebanese Pound',
      value: 'LBP',
    },
    {
      label: 'Lek',
      value: 'ALL',
    },
    {
      label: 'Lempira',
      value: 'HNL',
    },
    {
      label: 'Leone',
      value: 'SLL',
    },
    {
      label: 'Liberian Dollar',
      value: 'LRD',
    },
    {
      label: 'Libyan Dinar',
      value: 'LYD',
    },
    {
      label: 'Lilangeni',
      value: 'SZL',
    },
    {
      label: 'Lithuania Dollar',
      value: 'LUR',
    },
    {
      label: 'Loti,Rand',
      value: 'LSL',
    },
    {
      label: 'Malagasy Ariary',
      value: 'MGA',
    },
    {
      label: 'Malawi Kwacha',
      value: 'MWK',
    },
    {
      label: 'Malaysian Ringgit',
      value: 'MYR',
    },
    {
      label: 'Mauritius Rupee',
      value: 'MUR',
    },
    {
      label: 'Mexican Peso',
      value: 'MXN',
    },
    {
      label: 'Moldovan Leu',
      value: 'MDL',
    },
    {
      label: 'Moroccan Dirham',
      value: 'MAD',
    },
    {
      label: 'Mozambique Metical',
      value: 'MZN',
    },
    {
      label: 'Naira',
      value: 'NGN',
    },
    {
      label: 'Nakfa',
      value: 'ERN',
    },
    {
      label: 'Namibia Dollar,Rand',
      value: 'NAD',
    },
    {
      label: 'Nepalese Rupee',
      value: 'NPR',
    },
    {
      label: 'Netherlands Antillean Guilder',
      value: 'ANG',
    },
    {
      label: 'New Israeli Sheqel',
      value: 'ILS',
    },
    {
      label: 'New Zealand Dollar',
      value: 'NZD',
    },
    {
      label: 'Ngultrum',
      value: 'BTN',
    },
    {
      label: 'North Korean Won',
      value: 'KPW',
    },
    {
      label: 'Norwegian Krone',
      value: 'NOK',
    },
    {
      label: '',
      value: '',
    },
    {
      label: 'Pakistan Rupee',
      value: 'PKR',
    },
    {
      label: 'Pataca',
      value: 'MOP',
    },
    {
      label: 'Pa’anga',
      value: 'TOP',
    },
    {
      label: 'Peso Uruguayo',
      value: 'UYU',
    },
    {
      label: 'Philippines Piso',
      value: 'PHP',
    },
    {
      label: 'Pula',
      value: 'BWP',
    },
    {
      label: 'Qatari Rial',
      value: 'QAR',
    },
    {
      label: 'Quetzal',
      value: 'GTQ',
    },
    {
      label: 'Rand',
      value: 'ZAR',
    },
    {
      label: 'Rial Omani',
      value: 'OMR',
    },
    {
      label: 'Riel',
      value: 'KHR',
    },
    {
      label: 'Romanian Leu',
      value: 'RON',
    },
    {
      label: 'Rufiyaa',
      value: 'MVR',
    },
    {
      label: 'Rupiah',
      value: 'IDR',
    },
    {
      label: 'Russian Ruble',
      value: 'RUB',
    },
    {
      label: 'Rwanda Franc',
      value: 'RWF',
    },
    {
      label: 'Saint Helena Pound',
      value: 'SHP',
    },
    {
      label: 'Saudi Arabia Riyal',
      value: 'SAR',
    },
    {
      label: 'Serbian Dinar',
      value: 'RSD',
    },
    {
      label: 'Seychelles Rupee',
      value: 'SCR',
    },
    {
      label: 'Singapore Doller',
      value: 'SGD',
    },
    {
      label: 'Sol',
      value: 'PEN',
    },
    {
      label: 'Solomon Islands Dollar',
      value: 'SBD',
    },
    {
      label: 'Som',
      value: 'KGS',
    },
    {
      label: 'Somali Shilling',
      value: 'SOS',
    },
    {
      label: 'Somoni',
      value: 'TJS',
    },
    {
      label: 'South Sudanese Pound',
      value: 'SSP',
    },
    {
      label: 'Spain Dollar',
      value: 'ESR',
    },
    {
      label: 'Sri Lanka Rupee',
      value: 'LKR',
    },
    {
      label: 'Sudanese Pound',
      value: 'SDG',
    },
    {
      label: 'Surinam Dollar',
      value: 'SRD',
    },
    {
      label: 'Swedish Krona',
      value: 'SEK',
    },
    {
      label: 'Swiss Franc',
      value: 'CHF',
    },
    {
      label: 'Syrian Pound',
      value: 'SYP',
    },
    {
      label: 'Taiwan Dollar',
      value: 'TWD',
    },
    {
      label: 'Tala',
      value: 'WST',
    },
    {
      label: 'Tanzanian Shilling',
      value: 'TZS',
    },
    {
      label: 'Zloty',
      value: 'PLN',
    },
    {
      label: 'Euro',
      value: 'EUR',
    },
    {
      label: 'US Dollar',
      value: 'USD',
    },
    {
      label: 'Pound Sterling',
      value: 'GBP',
    },
  ];
  logoUrl = 'assets/vercado_small.png';
  action: string = 'create';

  constructor(
    private _fromBuilder: FormBuilder,
    private _apiService: ApiService,
    private _toastService: ToastService,
    private _router: Router,
    private _activeRoute: ActivatedRoute
  ) {
    // this.buildCreateTenantForm();
    // this.buildUpdateTenantForm();
    // this.buildStopTenantForm();
    this._activeRoute.params.subscribe((params: any) => {
      this.action = params?.action;
      this.handleFormBuilder();
    });
  }

  buildCreateTenantForm() {
    this.tenantCreateForm = this._fromBuilder.group({
      domainName: ['', Validators.required],
      tenantName: ['', Validators.required],
      customDomain: [''],
      apiKey: ['', Validators.required],
      email: [
        '',
        Validators.compose([
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
    });
  }

  buildBonanzaConnectForm() {
    this.bonanzaConnectForm = this._fromBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: [
        '',
        Validators.compose([
          Validators.email,
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
    });
  }

  buildUpdateTenantForm() {
    this.tenantUpdateForm = this._fromBuilder.group({
      tenantId: ['', Validators.required],
      customDomain: ['', Validators.required],
      sslCertificate: ['', Validators.required],
      privateKey: ['', Validators.required],
      bundle: [''],
    });
  }

  buildStopTenantForm() {
    this.tenantStopForm = this._fromBuilder.group({
      tenantId: ['', Validators.required],
      apiKey: ['', Validators.required],
    });
  }

  buildRemoveConstraintsForm() {
    this.removeConstraintsForm = this._fromBuilder.group({
      tenantId: ['', Validators.required],
    });
  }

  buildAddConstraintsForm() {
    this.addConstraintsForm = this._fromBuilder.group({
      tenantId: ['', Validators.required],
    });
  }

  buildRestartTenantForm() {
    this.restartTenantForm = this._fromBuilder.group({
      tenantId: ['', Validators.required],
    });
  }

  buildChlForm() {
    this.ghlForm = this._fromBuilder.group({
      name: ['', Validators.required],
      phone: [''],
      companyId: ['', Validators.required],
      address: [''],
      city: [''],
      state: [''],
      country: [
        null,
        Validators.compose([
          Validators.minLength(2),
          Validators.maxLength(2),
          Validators.required,
        ]),
      ],
      postalCode: [''],
      website: [''],
      timezone: [''],
      prospectInfo: this._fromBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [
          '',
          Validators.compose([
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
            Validators.required,
          ]),
        ],
      }),
      settings: this._fromBuilder.group({
        allowDuplicateContact: [''],
        allowDuplicateOpportunity: [''],
        allowFacebookNameMerge: [''],
        disableContactTimezone: [''],
      }),
      social: this._fromBuilder.group({
        facebookUrl: [''],
        googlePlus: [''],
        linkedIn: [''],
        foursquare: [''],
        twitter: [''],
        yelp: [''],
        instagram: [''],
        youtube: [''],
        pinterest: [''],
        blogRss: [''],
        googlePlacesId: [''],
      }),
      twilio: this._fromBuilder.group({
        sid: ['', Validators.required],
        authToken: ['', Validators.required],
      }),
      mailgun: this._fromBuilder.group({
        apiKey: ['', Validators.required],
        domain: ['', Validators.required],
      }),
      snapshotId: [''],
    });
  }

  buildBankeloOnBoardingForm() {
    this.bankeloInfoForm = this._fromBuilder.group({
      side: [null, Validators.required],
      organizationType: [null],
      industry: [null],
      registrationNumber: [null],
      legalName: [null, Validators.required],
      lineOfBusiness: [null],
      taxId: [null, Validators.required],
      countryOfOperation: [null, Validators.required],
      countryOfRegistration: [null, Validators.required],
      currencyCode: [null],
      website: [null],
      emailAddress: [
        null,
        Validators.compose([
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
      mobileCountryCode: [null, Validators.required],
      mobileNumber: [null],
      businessDescription: [null],
      addressLine1: [null, Validators.required],
      postalCode: [null, Validators.required],
      city: [null, Validators.required],
      province: [null, Validators.required],
      country: [null, Validators.required],
      tp: ['B', Validators.required],
      consent: ['Yes'],
      externalId: [null, Validators.required],
    });
  }

  onFileChangeKey(file: any) {
    this.privateKey = file.target.files[0];
  }

  onFileChangeSsl(file: any) {
    this.sslCertificate = file.target.files[0];
  }

  onCreateTenant() {
    this._apiService
      .post(API_CONSTANT.TENANT.CREATE, { body: this.tenantCreateForm.value })
      .subscribe({
        next: (res: any) => {
          this.tenantCreateForm.reset();
          this.selectedDomain = 'vercado.com';
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.TENANT.CREATE
          );
        },
      });
  }

  onUpdateTanant() {
    const formData = new FormData();
    const updateFormValue = this.tenantUpdateForm.value;
    // console.log(this.tenantUpdateForm.value);
    for (let key in updateFormValue) {
      if (this.sslCertificate && key === 'sslCertificate') {
        formData.append(key, this.sslCertificate);
      } else if (this.privateKey && key === 'privateKey') {
        formData.append(key, this.privateKey);
      } else if (this.bundle && key === 'bundle') {
        formData.append(key, this.bundle);
      } else {
        if (updateFormValue[key]) {
          formData.append(key, updateFormValue[key]);
        }
      }
    }
    this._apiService
      .put(API_CONSTANT.TENANT.UPDATE, { body: formData })
      .subscribe({
        next: (res: any) => {
          this.tenantUpdateForm.reset();
          this.sslCertificate = '';
          this.bundle = '';
          this.privateKey = '';
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.TENANT.UPDATE
          );
        },
      });
  }

  onStopTenant() {
    this._apiService
      .post(API_CONSTANT.TENANT.STOP, { body: this.tenantStopForm.value })
      .subscribe({
        next: (res: any) => {
          this.tenantStopForm.reset();
          this._toastService.showSuccess(
            res.message || res.response?.message || MESSAGE_CONSTANT.TENANT.STOP
          );
        },
      });
  }

  onRestartTenant() {
    this._apiService
      .post(API_CONSTANT.TENANT.RESTART, { body: this.restartTenantForm.value })
      .subscribe({
        next: (res: any) => {
          this.tenantStopForm.reset();
          this._toastService.showSuccess(
            res.message || res.response?.message || MESSAGE_CONSTANT.TENANT.STOP
          );
        },
      });
  }

  onRemoveConstraints() {
    this._apiService
      .post(API_CONSTANT.TENANT.REMOVE_CONSTRAINTS, {
        body: this.removeConstraintsForm.value,
      })
      .subscribe({
        next: (res: any) => {
          this.removeConstraintsForm.reset();
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.TENANT.REMOVE_CONSTRAINTS
          );
        },
      });
  }

  onAddConstraints() {
    this._apiService
      .post(API_CONSTANT.TENANT.ADD_CONSTRAINTS, {
        body: this.addConstraintsForm.value,
      })
      .subscribe({
        next: (res: any) => {
          this.addConstraintsForm.reset();
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.TENANT.ADD_CONSTRAINTS
          );
        },
      });
  }

  onSubmitBonanzaConnect() {
    this._apiService
      .post(API_CONSTANT.BONANZA_CONNECT.CREATE_TENANT, {
        body: this.bonanzaConnectForm.value,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.bonanzaConnectForm.reset();
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.BONANZA_CONNECT.CREATE_TENANT
          );
        },
      });
  }

  onSubmitGHLCreateLocation() {
    this._apiService
      .post(API_CONSTANT.GHL.CREATE_LOCATION, {
        body: this.ghlForm.value,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.bonanzaConnectForm.reset();
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.GHL.CREATE_LOCATION
          );
        },
      });
  }

  onCreateBenkelo() {
    this._apiService
      .post(
        `${API_CONSTANT.BANKELO.CREATE_TENANT}/${this.bankeloInfoForm.value.externalId}`,
        {
          body: this.bankeloInfoForm.value,
        }
      )
      .subscribe({
        next: (res: any) => {
          this.bankeloInfoForm.reset();
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.GHL.CREATE_LOCATION
          );
        },
      });
  }

  onNavigateToUpdate() {
    this.buildUpdateTenantForm();
    this.isTenantTab = true;
    this.isUpdateTenant = true;
    this.isStopTenant = false;
    this.isCreateTenant = false;
    this.isRemoveConstraints = false;
    this.isRestartTenant = false;
    this.isBonanzaConnect = false;
    this.isGHL = false;
    this.isTenantDetail = false;
    this.isbankelo = false;
  }

  onNavigateToStop() {
    this.buildStopTenantForm();
    this.isStopTenant = true;
    this.isTenantTab = true;
    this.isCreateTenant = false;
    this.isUpdateTenant = false;
    this.isRemoveConstraints = false;
    this.isRestartTenant = false;
    this.isBonanzaConnect = false;
    this.isGHL = false;
    this.isTenantDetail = false;
    this.isbankelo = false;
  }

  onNavigateToCreate() {
    this.buildCreateTenantForm();
    this.isTenantTab = true;
    this.isCreateTenant = true;
    this.isStopTenant = false;
    this.isUpdateTenant = false;
    this.isRemoveConstraints = false;
    this.isRestartTenant = false;
    this.isBonanzaConnect = false;
    this.isGHL = false;
    this.isTenantDetail = false;
    this.isbankelo = false;
  }

  onNavigateToRemoveConstraints() {
    this.buildRemoveConstraintsForm();
    this.isTenantTab = true;
    this.isRemoveConstraints = true;
    this.isCreateTenant = false;
    this.isStopTenant = false;
    this.isUpdateTenant = false;
    this.isRestartTenant = false;
    this.isBonanzaConnect = false;
    this.isGHL = false;
    this.isTenantDetail = false;
    this.isbankelo = false;
  }

  onNavigateToRestartTenant() {
    this.buildRestartTenantForm();
    this.isTenantTab = true;
    this.isRestartTenant = true;
    this.isCreateTenant = false;
    this.isStopTenant = false;
    this.isUpdateTenant = false;
    this.isRemoveConstraints = false;
    this.isBonanzaConnect = false;
    this.isGHL = false;
    this.isTenantDetail = false;
    this.isbankelo = false;
  }

  onNavigateToBonanzaConnect() {
    this.buildBonanzaConnectForm();
    this.isTenantTab = false;
    this.isBonanzaConnect = true;
    this.isRestartTenant = false;
    this.isCreateTenant = false;
    this.isStopTenant = false;
    this.isUpdateTenant = false;
    this.isRemoveConstraints = false;
    this.isGHL = false;
    this.isTenantDetail = false;
    this.isbankelo = false;
  }

  onNavigateToGHL() {
    this.buildChlForm();
    this.isGHL = true;
    this.isTenantTab = false;
    this.isBonanzaConnect = false;
    this.isRestartTenant = false;
    this.isCreateTenant = false;
    this.isStopTenant = false;
    this.isUpdateTenant = false;
    this.isRemoveConstraints = false;
    this.isTenantDetail = false;
    this.isbankelo = false;
  }

  onNavigateToTenantDetail() {
    this.isTenantDetail = true;
    this.isTenantTab = true;
    this.isGHL = false;
    this.isBonanzaConnect = false;
    this.isRestartTenant = false;
    this.isCreateTenant = false;
    this.isStopTenant = false;
    this.isUpdateTenant = false;
    this.isRemoveConstraints = false;
    this.isbankelo = false;
  }

  onNavigateToBankelo() {
    this.buildBankeloOnBoardingForm();
    this.isbankelo = true;
    this.isTenantTab = false;
    this.isTenantDetail = false;
    this.isGHL = false;
    this.isBonanzaConnect = false;
    this.isRestartTenant = false;
    this.isCreateTenant = false;
    this.isStopTenant = false;
    this.isUpdateTenant = false;
    this.isRemoveConstraints = false;
  }

  onSearchTenant() {
    this.isSearched = false;
    this._apiService
      .get(API_CONSTANT.TENANT.FETCH, {
        query: { tenantId: this.searchText.value },
      })
      .subscribe({
        next: (res: any) => {
          this.isSearched = true;
          if (res?.data) {
            this.searchResult = res.data;
          } else {
            this.searchResult = [];
          }
        },
      });
  }

  onLogout() {
    localStorage.clear();
    this._router.navigate([APP_CONSTANT.ROUTES.USER.LOGIN], {
      replaceUrl: true,
    });
  }

  onFileChangeBundle(file: any) {
    this.bundle = file.target.files[0];
  }

  onDownloadDocument(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '__blank';
    a.click();
  }

  onApplyForBuckzy() {
    this._apiService
      .post(API_CONSTANT.BANKELO.ONBOARDING, {
        body: { tenantId: this.searchResult?.tenantId },
      })
      .subscribe({
        next: (res: any) => {
          if (res?.status === 200) {
            this._toastService.showSuccess(
              res?.message || MESSAGE_CONSTANT.BANKELO.ONBOARDING
            );
          }
        },
      });
  }

  onSubmitDocumentForApproval(documentType: string) {
    this._apiService
      .post(
        `${API_CONSTANT.BANKELO.ONBOARDING_DOCUMENT}/${this.searchResult?.tenantId}/${documentType}`,
        { body: {} }
      )
      .subscribe({
        next: (res: any) => {
          this._toastService.showSuccess(
            res?.messsage || MESSAGE_CONSTANT.BANKELO.ONBOARDING_DOCUMENT
          );
        },
      });
  }

  handleFormBuilder() {
    switch (this.action) {
      case 'update':
        this.buildUpdateTenantForm();
        break;
      case 'stop':
        this.buildStopTenantForm();
        break;
      case 'public':
        this.buildRemoveConstraintsForm();
        break;
      case 'restart':
        this.buildRestartTenantForm();
        break;
      case 'ghl':
        this.buildChlForm();
        break;
      case 'bonanza-connect':
        this.buildBonanzaConnectForm();
        break;
      case 'private':
        this.buildAddConstraintsForm();
        break;
      default:
        this.buildCreateTenantForm();
        break;
    }
  }
}
