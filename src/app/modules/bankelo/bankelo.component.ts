import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { API_CONSTANT } from 'src/app/core/constant/api.constant';
import { MESSAGE_CONSTANT } from 'src/app/core/constant/message.constant';
import { ApiService } from 'src/app/core/services/api.services';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-bankelo',
  templateUrl: './bankelo.component.html',
  styleUrls: ['./bankelo.component.scss'],
})
export class BankeloComponent {
  bankeloInfoForm!: FormGroup;
  sides: any[] = [
    // {
    //   label: 'Sender',
    //   value: 'Debtor',
    // },
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
      valueWithPrefix: '1-CA',
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
      valueWithPrefix: '1-PR',
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
      valueWithPrefix: '1-US',
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
  logoUrl = 'assets/vercado_small.png'
  tenantId: string = '';
  isFileUpload: boolean = false;
  isBankelo: boolean = true;
  isShowNavbar: boolean = false;
  uploadFileForm!: FormGroup;
  ownerProofDocument: any;
  tooltip: string = '';
  ownerProofs: any[] = [
    {
      label: 'Driver Licence',
      value: 'D006',
    },
    {
      label: 'Passport',
      value: 'D002',
    },
  ];
  checkOrBankLettersDocument: any;
  checkOrBankLettersList: any[] = [
    {
      label: 'Voided cheque',
      value: 'D002',
    },
    {
      label: 'Bank Letter',
      value: 'D002',
    },
  ];
  businessProofDocument: any;
  businessProofs: any[] = [
    {
      label: 'Articles of Incorporation',
      value: 'D002',
    },
    {
      label: 'Government issued business licence',
      value: 'D002',
    },
    {
      label: 'Partnership agreement',
      value: 'D002',
    },
    {
      label: 'Bank references',
      value: 'D010',
    },
    {
      label:
        'Accountant prepared/compiled/audited financial statements/ tax returns',
      value: 'D002',
    },
    {
      label: 'IRS tax verification letter',
      value: 'D002',
    },
    {
      label:
        'Telephone bill or other utility bill with business name or address listed',
      value: 'D012',
    },
  ];
  isCheckOrBankLetter = false;
  isOwnerProof = false;
  isBusinessProof = false;
  token: string = '';
  tenatInfo: any;
  buttonText: string = 'Submit for Approval';
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('checkOrBankLetterCheckbox')
  checkOrBankLetterCheckbox!: ElementRef;
  @ViewChild('ownerProofCheckbox') ownerProofCheckbox!: ElementRef;
  @ViewChild('businessProofCheckbox') businessProofCheckbox!: ElementRef;
  isDisabled: boolean = true;
  model: NgbDateStruct = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  };
  bankLetterOrChequeUrl = '';
  ownerProofUrl = '';
  businessProofUrl = '';
  isBankLetterOrChequerSubmit: boolean = false;
  isBusinessProofSubmit: boolean = false;
  isOwnerProofSubmit: boolean = false;
  bankLetterOrChequeTooltip = 'Please save file.';
  businessProofTooltip = 'Please save file.';
  ownerProofTooltip = 'Please save file.';

  constructor(
    private _fromBuilder: FormBuilder,
    private _apiService: ApiService,
    private _toastService: ToastService,
    private _activatedRoute: ActivatedRoute,
    private _storageService: StorageService
  ) {
    this.buildBankeloOnBoardingForm();
    this.buildFileForm();
    // console.log(this._activatedRoute.params.subscribe)
    // // this.tenantId = this._activatedRoute.snapshot.queryParams
    this._activatedRoute.params.subscribe((param: any) => {
      this.tenantId = param.tenantId;
      if (param.token) {
        this._storageService.setEncryptedToken(param.token, this.tenantId);
      }
      if (this.tenantId) {
        this.bankeloInfoForm.get('externalId')?.setValue(this.tenantId);
      }
      this.onFetchTenant();
    });
  }
  onFetchTenant() {
    this._apiService
      .get(API_CONSTANT.TENANT.FETCH, { query: { tenantId: this.tenantId } })
      .subscribe({
        next: (res: any) => {
          // console.log(res.data.bankelo);
          if (res.status === 200 && res?.data?.bankelo) {
            this.bankeloInfoForm.patchValue(res?.data?.bankelo);
            if (res?.data?.bankelo?.establishmentDate) {
              const splitedDate =
                res?.data?.bankelo?.establishmentDate.split('-');
              this.model = {
                year: Number(splitedDate[0]),
                month: Number(splitedDate[1]),
                day: Number(splitedDate[2]),
              };
            }
            // this.isFileUpload = true;
            this.isShowNavbar = true;
            this.tenatInfo = res?.data;
            let uploadFileFormData = {
              ownerProof: '',
              businessProof: '',
              checkOrBankLetter: '',
              businessProofId: '',
              ownerProofId: '',
              checkOrBankLetterId: '',
            };
            if (res?.data?.bankelo?.documents) {
              res?.data?.bankelo?.documents.forEach((item: any) => {
                if (item.type === 'checkOrBankLetter') {
                  this.bankLetterOrChequeTooltip = '';
                  uploadFileFormData.checkOrBankLetter = item.subType;
                  uploadFileFormData.checkOrBankLetterId = item.identifier;
                  this.bankLetterOrChequeUrl = item.url;
                  if(item.id){
                    this.isBankLetterOrChequerSubmit = true;
                    this.bankLetterOrChequeTooltip = 'Document submitted for approval.'
                  }
                } else if (item.type === 'ownerProof') {
                  this.ownerProofTooltip = '';
                  uploadFileFormData.ownerProof = item.subType;
                  uploadFileFormData.ownerProofId = item.identifier;
                  this.ownerProofUrl = item.url;
                  if(item.id){
                    this.isOwnerProofSubmit = true;
                    this.ownerProofTooltip = 'Document submitted for approval.';
                  }
                } else if(item.type === 'businessProof') {
                  this.businessProofTooltip = '';
                  uploadFileFormData.businessProof = item.subType;
                  uploadFileFormData.businessProofId = item.identifier;
                  this.businessProofUrl = item.url;
                   if(item.id){
                    this.isBusinessProofSubmit = true;
                    this.businessProofTooltip = 'Document submitted for approval.'
                  }
                }
              });
              if(!res?.data?.bankelo?.id){
                this.bankLetterOrChequeTooltip = 'Please submit merchant detail for approval.'
                this.ownerProofTooltip = 'Please submit merchant detail for approval.'
                this.businessProofTooltip = 'Please submit merchant detail for approval.'
                
              }
              this.uploadFileForm.patchValue(uploadFileFormData);
            }
          }
          this.getOnboardingStatus(res?.data?.bankelo);
        },
      });
  }

  getOnboardingStatus(bankeloContent: any) {
    if (!bankeloContent || bankeloContent.status === 'SUBMITTED_FOR_CUSTOMER') {
      if (!bankeloContent) {
        this.tooltip = 'Please save the detail.';
      } else {
        this.tooltip = 'Submitted for approval.';
      }
      console.log(this.tooltip);
      this.isDisabled = true;
    } else if (bankeloContent.status === 'PENDING') {
      this.isDisabled = false;
    } else {
      this.isDisabled = false;
      this.buttonText = 'Re-submit';
    }
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
      mobileNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(100000),
          Validators.max(999999999999999),
        ]),
      ],
      businessDescription: [null],
      addressLine1: [null, Validators.required],
      postalCode: [null, Validators.required],
      city: [null, Validators.required],
      province: [null, Validators.required],
      country: [null, Validators.required],
      tp: ['B', Validators.required],
      consent: ['Yes'],
      externalId: [null, Validators.required],
      establishmentDate: [this.model, Validators.required],
    });
  }

  // buildBankeloOnBoardingForm() {
  //   this.bankeloInfoForm = this._fromBuilder.group({
  //     registrationNumber: [null],
  //     legalName: [null, Validators.required],
  //     lineOfBusiness: [null],
  //     taxId: [null, Validators.required],
  //     countryOfOperation: [null, Validators.required],
  //     countryOfRegistration: [null, Validators.required],
  //     emailAddress: [
  //       null,
  //       Validators.compose([
  //         Validators.email,
  //         Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
  //       ]),
  //     ],
  //     mobileCountryCode: [null, Validators.required],
  //     mobileNumber: [
  //       null,
  //       Validators.compose([
  //         Validators.required,
  //         Validators.min(100000),
  //         Validators.max(999999999999999),
  //       ]),
  //     ],

  //     addressLine1: [null, Validators.required],
  //     postalCode: [null, Validators.required],
  //     city: [null, Validators.required],
  //     province: [null, Validators.required],
  //     country: [null, Validators.required],
  //     establishmentDate: ['', Validators.required],
  //   });
  // }

  buildFileForm() {
    this.uploadFileForm = this._fromBuilder.group({
      ownerProof: [''],
      checkOrBankLetter: [''],
      businessProof: [''],
      businessProofId: [''],
      ownerProofId: [''],
      checkOrBankLetterId: [''],
    });
  }

  onCreateBenkelo() {
    const establishmentDate = this.bankeloInfoForm.value.establishmentDate;
    this.bankeloInfoForm.value.establishmentDate = moment(
      `${establishmentDate.year}-${establishmentDate.month}-${establishmentDate.day}`
    ).format('YYYY-MM-DD');
    // this.bankeloInfoForm.value.establishmentDate = moment(`${establishmentDate.year}-${establishmentDate.month + 1}-${establishmentDate.date}`).format('YYYY-MM-DD');

    this._apiService
      .post(`${API_CONSTANT.BANKELO.CREATE_TENANT}/${this.tenantId}`, {
        body: this.bankeloInfoForm.value,
      })
      .subscribe({
        next: (res: any) => {
          this.bankeloInfoForm.reset();
          this.onFetchTenant();
          this._toastService.showSuccess(
            res.message ||
              res.response?.message ||
              MESSAGE_CONSTANT.TENANT.CREATE
          );
        },
      });
  }

  onUploadFile(): void {
    const formData = new FormData();
    let isValid: boolean = false;
    const formValue = this.uploadFileForm.value;
    for (let key in formValue) {
      if (key && formValue[key]) {
        if (this.checkOrBankLettersDocument && key === 'checkOrBankLetter') {
          isValid = true;
          formData.append(`checkOrBankLetter`, this.checkOrBankLettersDocument);
          formData.append(`${key}Type`, formValue[key]);
          if (!formValue.checkOrBankLetterId) {
            this._toastService.showError(
              'Please enter bank letter or check number'
            );
            return;
          }
        } else if (this.ownerProofDocument && key === 'ownerProof') {
          isValid = true;
          formData.append(`ownerProof`, this.ownerProofDocument);
          formData.append(`${key}Type`, formValue[key]);
          console.log(formValue.ownerProofId);
          if (!formValue.ownerProofId) {
            this._toastService.showError('Please enter document number');
            return;
          }
        } else if (this.businessProofDocument && key === 'businessProof') {
          isValid = true;
          formData.append(`businessProof`, this.businessProofDocument);
          formData.append(`${key}Type`, formValue[key]);
          if (!formValue.businessProofId) {
            this._toastService.showError('Please enter document number');
            return;
          }
        } else {
          formData.append(key, formValue[key]);
        }
      }
    }
    // Object.keys(this.uploadFileForm?.value).forEach((item: any) => {
    //   console.log(item, "====item====")

    // });
    if (!isValid) {
      this._toastService.showError('Please upload at least one document.');
      return;
    }
    this._apiService
      .post(`${API_CONSTANT.BANKELO.UPLOAD_DOCUMENT}/${this.tenantId}`, {
        body: formData,
      })
      .subscribe({
        next: (res: any) => {
          this.uploadFileForm.reset();
          this.businessProofDocument = '';
          this.checkOrBankLettersDocument = '';
          this.ownerProofDocument = '';
          this._toastService.showSuccess(
            res?.body?.message || 'Document successfully uploaded'
          );
          this.fileInput.nativeElement.value = '';
          this.onFetchTenant();
        },
      });
  }

  onNavigateBankelo() {
    this.buildBankeloOnBoardingForm();
    this.isBankelo = true;
    this.isFileUpload = false;
    this.bankeloInfoForm.patchValue(this.tenatInfo?.bankelo);
  }

  onNavigateFileUpload() {
    this.isFileUpload = true;
    this.isBankelo = false;
    setTimeout(() => {
      this.checkOrBankLetterCheckbox.nativeElement.checked =
        this.isCheckOrBankLetter;
      this.businessProofCheckbox.nativeElement.checked = this.isBusinessProof;
      this.ownerProofCheckbox.nativeElement.checked = this.isOwnerProof;
    }, 200);
  }

  onChangeCheckBox($event: any) {
    const checkBoxValue = $event?.target?.value;
    const isChecked = $event?.target?.checked;
    if (checkBoxValue === 'checkOrBankLetter') {
      this.isCheckOrBankLetter = isChecked;
      if (!this.isCheckOrBankLetter) {
        this.checkOrBankLettersDocument = '';
        this.uploadFileForm.value.checkOrBankLetter = '';
      }
    } else if (checkBoxValue === 'businessProof') {
      this.isBusinessProof = isChecked;
      if (!this.isBusinessProof) {
        this.businessProofDocument = '';
        this.uploadFileForm.value.businessProof = '';
      }
    } else if (checkBoxValue === 'ownerProof') {
      this.isOwnerProof = isChecked;
      if (!this.isOwnerProof) {
        this.ownerProofDocument = '';
        this.uploadFileForm.value.ownerProof = '';
      }
    }
  }

  onFileChange($event: any, validateKey: string) {
    const file = $event.target.files[0];
    if (validateKey === 'checkOrBankLetter') {
      this.checkOrBankLettersDocument = file;
    } else if (validateKey === 'businessProof') {
      this.businessProofDocument = file;
    } else if (validateKey === 'ownerProof') {
      this.ownerProofDocument = file;
    }
  }

  onApplyForBuckzy(userType: string) {
    this._apiService
      .post(`${API_CONSTANT.BANKELO.ONBOARDING}`, {
        body: { tenantId: this.tenantId },
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

  onDownloadDocument(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '__blank';
    a.click();
  }

  onSubmitDocumentForApproval(documentType?: string) {
    this._apiService
      .post(
        `${API_CONSTANT.BANKELO.ONBOARDING_DOCUMENT}/${this.tenantId}/${documentType}`,
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
}
