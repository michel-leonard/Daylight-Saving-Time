
## World Map with 552 Timezones and Daylight Saving Time

- This version of the software (all files) is released into the public domain.
- The software is provided "as it" without any warranty, express or implied.

The software provide the entire **history of DST** for all time zones, and a **SVG world map** with all time zones displaying their next seasonal transition on mouseover. The source code is only 20KB when compressed. You can check the [live examples](https://michel-leonard.github.io/Daylight-Saving-Time/).

- **Precision:**
    - The function that detect seasonal transition is precise to the second.

- **Compatibility:**
    - **Node.js:** The function is fully compatible with Node.js, allowing for server or browser use.
    - **Browser Support:** Works across many modern browsers that support the `Intl` object.
    - **Polyfill:** A polyfill is provided to ensure compatibility with environments that don't support `Intl`.

### **Function Definition**

- **Parameters:**
    - `timeZone`: A string representing the time zone to check, e.g., `'America/Denver'`.
    - `dateFrom` (optional): The start date for checking DST transitions. Defaults to the current date.
    - `dateEnd` (optional): The end date for checking DST transitions. Defaults to one year after `dateFrom`.

- **Return Value:**
    - The function is a generator that yields as an integer the last millisecond before each DST transition within the
      specified date range.

### How the function works ?

By using a generator, the `getDSTTransitions` function optimizes resource use and offers flexibility in how results are
retrieved.

1. **Checking the Time at the Start of Each Month**

The algorithm begins by checking the formatted time (HH:MM:SS) at the start of each month within the specified date
range. This is done using the `Intl.DateTimeFormat` formatter for the given time zone.

2. **Detecting a DST Change**

The function compares the formatted time of two consecutive months. If there's a difference in the time between two
months, it indicates that a DST transition has occurred.

3. **Finding the Exact Moment with a Binary Search**

Once a DST change is detected, the algorithm uses a binary search to efficiently narrow down the exact second when the
time change occurred. This step ensures that the function is precise to the exact second of the transition.

4. **Yielding the Result**

After pinpointing the exact moment of the DST change, the function yields the corresponding timestamp, which is the last
millisecond before a clock jump. If you're only interested in the first result, you can stop here, or you can continue
iterating to find all transitions within the specified date range.

### 3. **Basic Usage**

The provided example files should give users a clear starting point for integrating this functionality into your own
project.

#### **Example 1: Listing DST Transitions for a Specific Time Zone**

- **Scenario:** Detecting the next DST transitions for `America/Denver`.

```javascript
const timeZone = 'America/Denver'
for (const unix_ms of getDSTTransitions(timeZone)) {
	const s_1 = new Date(unix_ms).toLocaleString([], {timeZone})
	const s_2 = new Date(unix_ms + 1).toLocaleString([], {timeZone})
	console.log(s_1, ' to ', s_2)
}
```

#### **Example 2: Show the next DST Transition for a Specific Time Zone**

- **Scenario:** Get the last millisecond before a time change for `America/Denver`.

```javascript
const tz_name = 'America/Denver'
const ms = getDSTTransitions(tz_name).next().value

// You can use a formatter to display the date information
const opts = {
	timeZone: tz_name,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	hourCycle: 'h23',
}
const formatter = new Intl.DateTimeFormat('en-US', opts)
console.log(formatter.format(ms), ' to ', formatter.format(ms + 1))
```

### History of DST - Data Source
The `Intl.DateTimeFormat` API in JavaScript relies on the underlying system's time zone database, often based on the [IANA Time Zone Database](https://www.iana.org/time-zones) (also known as the [tz database](https://ftp.iana.org/tz/releases)). This database contains historical time zone information, but its accuracy can vary, especially for dates far in the past.

The underlying system (for example Windows and Firefox) may interpret or apply historical time zone shifts differently than expected.

### Geocode dataset
552 [IANA timezones](https://data.iana.org/time-zones/tzdb-latest.tar.lz) have been geocoded to provide the SVG World Map of Timezones.
|IANA TimeZone|Latitude|Longitude|
|--|--|--|
|Indian/Cocos|-12.155|96.868|
|Cuba|22.011|-78.658|
|PST8PDT|43.214|-123.343|
|America/Recife|-8.044|-34.926|
|Australia/South|-30.286|135.426|
|Europe/Luxembourg|49.753|6.095|
|Pacific/Funafuti|-8.521|179.198|
|Antarctica/South_Pole|-90|0|
|Africa/Harare|-17.834|31.045|
|Africa/Djibouti|11.741|42.492|
|Antarctica/Palmer|-64.774|-64.054|
|America/Tortola|18.433|-64.633|
|Europe/Vienna|48.202|16.379|
|Asia/Beirut|33.894|35.499|
|America/Cuiaba|-15.607|-56.05|
|Atlantic/Bermuda|32.304|-64.754|
|America/Indiana/Marengo|38.371|-86.344|
|Japan|36.663|138.093|
|Europe/Belfast|54.597|-5.934|
|America/Thunder_Bay|48.418|-89.297|
|Australia/North|-20.092|133.476|
|Atlantic/Faroe|62.032|-6.765|
|America/Jujuy|-23.264|-65.712|
|Chile/Continental|-35.675|-71.543|
|America/St_Thomas|18.338|-64.894|
|Asia/Almaty|43.224|76.93|
|Asia/Chita|52.053|113.473|
|America/Antigua|17.075|-61.812|
|America/Inuvik|71.987|-125.251|
|America/Goose_Bay|53.314|-60.421|
|Libya|26.335|17.228|
|America/Cancun|21.162|-86.858|
|Antarctica/Davis|-68.577|77.968|
|Pacific/Port_Moresby|-9.443|147.182|
|Africa/Mogadishu|2.049|45.326|
|Europe/Amsterdam|52.373|4.881|
|Atlantic/South_Georgia|-54.364|-36.65|
|America/Pangnirtung|66.148|-65.697|
|Australia/Victoria|-37.121|144.526|
|America/Punta_Arenas|-53.15|-70.911|
|Europe/Samara|53.223|50.21|
|Australia/ACT|-35.496|148.976|
|Atlantic/Madeira|32.758|-16.958|
|America/Anchorage|61.164|-149.215|
|Pacific/Wallis|-14.309|-178.123|
|Asia/Dili|-8.56|125.572|
|Asia/Irkutsk|52.288|104.301|
|America/St_Johns|47.488|-52.804|
|Europe/Jersey|49.218|-2.127|
|Antarctica/Troll|-72.012|2.534|
|Pacific/Gambier|-23.122|-134.969|
|Europe/Prague|50.075|14.45|
|Antarctica/McMurdo|-77.841|166.675|
|Antarctica/Macquarie|-54.5|158.936|
|Australia/Queensland|-22.835|144.469|
|America/Argentina/Cordoba|-32.204|-63.622|
|Asia/Dacca|23.79|90.411|
|America/Indiana/Petersburg|38.492|-87.279|
|America/Lower_Princes|18.048|-63.047|
|America/Indiana/Vincennes|38.676|-87.514|
|America/Rosario|-32.954|-60.695|
|America/Argentina/ComodRivadavia|-45.836|-67.498|
|Iceland|64.963|-19.021|
|America/Guatemala|15.783|-90.231|
|Asia/Qyzylorda|44.834|65.526|
|America/Panama|8.538|-80.782|
|America/Managua|12.112|-86.245|
|America/North_Dakota/New_Salem|46.844|-101.417|
|Navajo|36.067|-109.188|
|Poland|51.919|19.145|
|Asia/Harbin|45.761|126.643|
|America/Blanc-Sablon|51.508|-57.202|
|America/Manaus|-3.053|-59.989|
|America/Rankin_Inlet|62.825|-92.128|
|US/Mountain|47.53|-112.686|
|EST|42.115|-75.907|
|US/Samoa|-14.283|-170.71|
|America/Argentina/Catamarca|-28.466|-65.778|
|Europe/Zurich|47.386|8.523|
|Brazil/West|-15.228|-55.286|
|America/Buenos_Aires|-34.605|-58.424|
|Africa/Ndjamena|12.121|15.055|
|Asia/Taipei|25.065|121.55|
|America/Noronha|-3.855|-32.424|
|Pacific/Guadalcanal|-9.638|160.216|
|America/Bahia_Banderas|20.82|-105.297|
|Asia/Dhaka|23.785|90.412|
|MST|42.363|-107.444|
|Europe/Tallinn|59.416|24.745|
|Europe/Podgorica|42.435|19.261|
|America/Argentina/Jujuy|-23.144|-65.822|
|America/Puerto_Rico|18.202|-66.486|
|Europe/Vaduz|47.147|9.525|
|Singapore|1.359|103.801|
|Europe/Athens|37.988|23.732|
|Europe/Berlin|52.51|13.399|
|Turkey|38.77|35.289|
|America/Ojinaga|29.546|-104.413|
|Europe/Moscow|55.757|37.617|
|America/Jamaica|18.11|-77.298|
|Portugal|39.4|-8.225|
|Pacific/Midway|28.21|-177.376|
|Pacific/Chuuk|7.413|151.843|
|Australia/Yancowinna|-31.816|141.911|
|Asia/Famagusta|35.114|33.933|
|America/Los_Angeles|34.074|-118.4|
|Asia/Bahrain|26.106|50.547|
|Europe/Copenhagen|55.676|12.567|
|America/Kentucky/Louisville|38.193|-85.672|
|America/Argentina/Buenos_Aires|-34.609|-58.438|
|America/Coral_Harbour|64.138|-83.163|
|Indian/Reunion|-21.136|55.472|
|America/Asuncion|-25.287|-57.597|
|America/Lima|-12.045|-77.039|
|Pacific/Apia|-13.83|-171.769|
|Canada/Yukon|63.294|-136.057|
|America/Argentina/Salta|-24.659|-64.527|
|Asia/Choibalsan|48.084|114.546|
|Pacific/Chatham|-43.932|-176.527|
|Australia/Canberra|-35.281|149.129|
|US/Aleutian|54.147|-165.608|
|Antarctica/Casey|-66.282|110.527|
|Africa/Bissau|12.045|-14.904|
|Pacific/Kwajalein|9.396|167.474|
|Africa/Algiers|36.731|3.085|
|America/Ensenada|31.865|-116.601|
|Africa/Porto-Novo|6.492|2.623|
|Europe/Paris|48.857|2.345|
|America/North_Dakota/Center|47.115|-101.298|
|America/Bogota|4.662|-74.097|
|America/Knox_IN|41.29|-86.622|
|Africa/Bamako|12.598|-7.988|
|America/Merida|20.97|-89.625|
|Africa/El_Aaiun|27.138|-13.19|
|America/Montserrat|16.743|-62.187|
|America/Fort_Nelson|58.805|-122.693|
|Africa/Gaborone|-24.628|25.934|
|Asia/Jerusalem|31.769|35.215|
|US/Michigan|43.379|-84.66|
|America/Porto_Velho|-8.766|-63.874|
|Europe/Sofia|42.689|23.334|
|Asia/Thimbu|27.468|89.637|
|Africa/Brazzaville|-4.266|15.248|
|America/Kralendijk|12.19|-68.264|
|Africa/Douala|4.047|9.76|
|America/Marigot|18.068|-63.082|
|Europe/Simferopol|44.953|34.102|
|America/Iqaluit|63.747|-68.517|
|America/Dominica|15.409|-61.346|
|WET|40.705|-7.949|
|America/Araguaina|-7.191|-48.207|
|America/Chicago|41.836|-87.68|
|Africa/Ouagadougou|12.368|-1.531|
|Asia/Khandyga|62.656|135.556|
|Africa/Lome|6.15|1.23|
|Africa/Sao_Tome|0.254|6.631|
|Europe/Kiev|50.446|30.554|
|Africa/Asmera|15.332|38.93|
|Pacific/Easter|-27.153|-109.435|
|Australia/Darwin|-12.433|130.923|
|Pacific/Pitcairn|-25.066|-130.101|
|America/Tijuana|32.487|-116.984|
|Brazil/East|-8.609|-41.283|
|Pacific/Wake|19.28|166.65|
|America/Mendoza|-34.266|-68.644|
|Asia/Bangkok|13.774|100.607|
|Asia/Magadan|59.557|150.812|
|Africa/Bangui|4.376|18.57|
|America/Costa_Rica|9.935|-84.087|
|GB-Eire|52.987|-8.019|
|Europe/Monaco|43.737|7.421|
|Europe/Helsinki|60.17|24.938|
|Europe/Malta|35.889|14.445|
|MST7MDT|35.106|-106.629|
|America/Whitehorse|60.717|-135.08|
|Pacific/Tarawa|1.498|173.017|
|Asia/Vientiane|17.976|102.633|
|Africa/Monrovia|6.308|-10.803|
|Canada/Eastern|48.981|-76.468|
|Africa/Kinshasa|-4.397|15.307|
|America/Indianapolis|39.768|-86.16|
|America/Resolute|74.716|-94.978|
|America/North_Dakota/Beulah|47.267|-101.78|
|America/Yellowknife|62.453|-114.37|
|America/Louisville|38.246|-85.752|
|America/Grand_Turk|21.428|-71.142|
|Asia/Makassar|-5.153|119.437|
|Asia/Riyadh|24.714|46.762|
|US/Alaska|65.171|-152.089|
|America/Porto_Acre|-9.594|-67.541|
|GB|54.524|-2.318|
|Asia/Kolkata|22.559|88.366|
|Canada/Saskatchewan|54.544|-105.814|
|America/Curacao|12.122|-68.93|
|Europe/Isle_of_Man|54.232|-4.521|
|America/Mazatlan|23.25|-106.411|
|Asia/Ashkhabad|37.97|58.298|
|Africa/Johannesburg|-26.2|28.03|
|America/Dawson|64.061|-139.437|
|Asia/Tehran|35.712|51.336|
|America/Argentina/Ushuaia|-54.802|-68.303|
|America/Boise|43.603|-116.206|
|America/Atka|52.209|-174.203|
|Africa/Kigali|-1.959|30.117|
|Pacific/Kiritimati|1.984|-157.474|
|Pacific/Niue|-19.064|-169.857|
|America/Toronto|43.73|-79.449|
|Eire|53.09|-7.908|
|Asia/Ulan_Bator|47.917|106.917|
|Africa/Tunis|36.806|10.18|
|Atlantic/Cape_Verde|15.074|-23.629|
|Africa/Asmara|15.332|38.93|
|Asia/Hebron|31.532|35.101|
|US/Central|36.998|-94.612|
|Africa/Freetown|8.487|-13.236|
|America/Indiana/Tell_City|37.95|-86.765|
|Australia/Melbourne|-37.851|145.12|
|Chile/EasterIsland|-27.123|-109.358|
|Europe/Bucharest|44.435|26.102|
|America/Atikokan|48.759|-91.614|
|Asia/Oral|51.228|51.386|
|Asia/Dushanbe|38.561|68.773|
|America/Halifax|44.65|-63.637|
|Pacific/Saipan|15.185|145.745|
|US/Hawaii|21.454|-157.99|
|Europe/Guernsey|49.452|-2.583|
|Africa/Ceuta|35.887|-5.331|
|Europe/Skopje|41.996|21.441|
|Europe/Chisinau|47.016|28.846|
|Asia/Karachi|24.99|67.181|
|Indian/Mahe|-4.707|55.501|
|Arctic/Longyearbyen|78.22|15.641|
|America/St_Vincent|13.26|-61.19|
|Indian/Mayotte|-12.819|45.154|
|Asia/Yekaterinburg|56.836|60.613|
|Asia/Jakarta|-6.204|106.828|
|Asia/Tokyo|35.706|139.655|
|Africa/Nairobi|-1.275|36.812|
|Asia/Sakhalin|50.523|142.711|
|America/Sitka|57.132|-135.058|
|Pacific/Galapagos|-0.628|-90.388|
|Pacific/Enderbury|-3.131|-171.086|
|Africa/Niamey|13.509|2.114|
|America/Menominee|45.113|-87.624|
|Europe/Uzhgorod|48.618|22.289|
|Kwajalein|8.723|167.735|
|Australia/Hobart|-42.881|147.326|
|America/Argentina/Rio_Gallegos|-51.629|-69.259|
|US/Eastern|32.843|-83.63|
|Asia/Macao|22.191|113.55|
|America/Scoresbysund|70.486|-21.964|
|Atlantic/Faeroe|62.156|-7.078|
|Asia/Aqtobe|50.289|57.205|
|Europe/Zaporozhye|47.834|35.17|
|America/Belem|-1.389|-48.462|
|Europe/Lisbon|38.738|-9.156|
|America/Indiana/Indianapolis|39.783|-86.142|
|Atlantic/Stanley|-51.694|-57.86|
|America/Guyana|4.917|-59.45|
|America/Santiago|-33.478|-70.642|
|Australia/Eucla|-31.759|128.555|
|Asia/Aden|12.786|45.012|
|Pacific/Guam|13.444|144.768|
|Europe/London|51.511|-0.119|
|Asia/Tel_Aviv|32.08|34.781|
|Pacific/Kosrae|5.31|162.975|
|Pacific/Yap|9.535|138.109|
|Antarctica/Mawson|-67.603|62.874|
|America/St_Barthelemy|17.895|-62.828|
|Indian/Chagos|-6.67|71.337|
|Pacific/Truk|7.446|151.842|
|Mexico/General|19.358|-99.153|
|America/Yakutat|59.509|-139.659|
|America/Maceio|-9.602|-35.728|
|Asia/Aqtau|43.639|51.256|
|Indian/Christmas|-10.493|105.635|
|Hongkong|22.377|114.179|
|Asia/Saigon|10.751|106.659|
|Europe/Kyiv|50.42|30.548|
|America/Argentina/La_Rioja|-29.42|-66.861|
|EST5EDT|35.397|-78.002|
|Atlantic/Canary|28.298|-16.51|
|America/Cayenne|4.933|-52.31|
|America/Montreal|45.516|-73.643|
|Europe/Vatican|41.904|12.452|
|Asia/Jayapura|-2.606|140.669|
|America/Miquelon|47.098|-56.381|
|PRC|34.541|108.936|
|America/Grenada|12.137|-61.69|
|Pacific/Auckland|-36.89|174.76|
|America/Eirunepe|-6.662|-69.868|
|Africa/Lagos|6.46|3.315|
|HST|19.692|-155.48|
|ROC|23.988|120.974|
|Europe/Sarajevo|43.861|18.401|
|America/Fort_Wayne|41.077|-85.139|
|EET|49.239|28.493|
|Asia/Colombo|6.912|79.865|
|America/Indiana/Winamac|41.051|-86.604|
|Pacific/Noumea|-22.268|166.456|
|Asia/Kuala_Lumpur|3.135|101.695|
|America/Guadeloupe|16.297|-61.441|
|Africa/Bujumbura|-3.361|29.368|
|Asia/Istanbul|41.009|29.062|
|Antarctica/Vostok|-78.464|106.834|
|Asia/Pontianak|-0.035|109.333|
|Canada/Central|53.874|-92.177|
|ROK|36.444|127.874|
|Atlantic/Azores|37.779|-25.494|
|Pacific/Fiji|-17.852|177.895|
|Europe/Mariehamn|60.097|19.939|
|Europe/San_Marino|43.939|12.459|
|America/Shiprock|36.785|-108.685|
|America/Cayman|19.291|-81.374|
|Africa/Lubumbashi|-11.67|27.495|
|Pacific/Palau|7.464|134.56|
|Europe/Budapest|47.476|19.099|
|Asia/Yerevan|40.15|44.519|
|Africa/Libreville|0.408|9.469|
|America/Caracas|10.461|-66.912|
|Asia/Ho_Chi_Minh|10.749|106.66|
|Pacific/Fakaofo|-9.386|-171.247|
|Jamaica|18.15|-77.314|
|America/Tegucigalpa|14.071|-87.198|
|Indian/Comoro|-11.703|43.255|
|Asia/Atyrau|47.105|51.929|
|Asia/Baku|40.408|49.874|
|America/Campo_Grande|-20.468|-54.613|
|Indian/Maldives|4.217|73.541|
|Africa/Conakry|9.643|-13.587|
|Asia/Kathmandu|27.71|85.322|
|Africa/Blantyre|-15.784|35.023|
|America/St_Lucia|13.93|-60.972|
|America/Creston|49.099|-116.514|
|Europe/Vilnius|54.681|25.273|
|America/Port-au-Prince|18.574|-72.301|
|Egypt|25.7|28.912|
|Asia/Tomsk|56.501|85|
|America/La_Paz|-16.499|-68.116|
|Australia/Lindeman|-20.448|149.041|
|Asia/Yakutsk|62.028|129.703|
|Europe/Rome|41.898|12.497|
|America/Cambridge_Bay|69.118|-105.058|
|America/Nipigon|49.014|-88.266|
|Asia/Qostanay|53.219|63.606|
|Africa/Dar_es_Salaam|-6.826|39.197|
|America/Denver|39.729|-104.96|
|America/Havana|23.064|-82.339|
|Africa/Kampala|0.319|32.582|
|Asia/Hovd|47.986|91.639|
|Africa/Abidjan|5.354|-4.002|
|Europe/Busingen|47.698|8.69|
|Asia/Srednekolymsk|67.456|153.704|
|America/Rio_Branco|-9.976|-67.827|
|America/Mexico_City|19.341|-99.137|
|Europe/Tiraspol|46.848|29.613|
|America/Virgin|17.729|-64.774|
|Antarctica/Syowa|-69.004|39.582|
|Indian/Mauritius|-20.299|57.536|
|Africa/Maseru|-29.366|27.514|
|Pacific/Marquesas|-9.763|-139|
|Asia/Qatar|25.305|51.197|
|NZ|-41.324|174.775|
|America/Santa_Isabel|32.63|-115.573|
|Australia/Lord_Howe|-31.554|159.087|
|America/Catamarca|-27.654|-67.031|
|Asia/Samarkand|39.656|66.962|
|Asia/Brunei|4.527|114.575|
|Asia/Novosibirsk|54.995|82.87|
|America/Argentina/Tucuman|-26.825|-65.232|
|America/Bahia|-12.393|-41.918|
|America/Santo_Domingo|18.484|-69.941|
|America/Moncton|46.101|-64.811|
|Europe/Belgrade|44.794|20.448|
|Antarctica/DumontDUrville|-66.663|140.003|
|America/Indiana/Vevay|38.748|-85.067|
|Pacific/Majuro|7.148|171.031|
|America/Anguilla|18.216|-63.052|
|America/Ciudad_Juarez|31.665|-106.427|
|America/Juneau|58.303|-134.417|
|Europe/Ulyanovsk|54.291|48.255|
|Asia/Hong_Kong|22.375|114.188|
|Europe/Kirov|58.581|49.659|
|Africa/Dakar|14.723|-17.458|
|Asia/Omsk|54.973|73.389|
|Europe/Madrid|40.422|-3.68|
|America/Regina|50.447|-104.618|
|Europe/Warsaw|52.232|21.021|
|Africa/Luanda|-8.847|13.281|
|America/Indiana/Knox|41.291|-86.621|
|Australia/West|-26.304|121.921|
|Australia/Broken_Hill|-31.956|141.47|
|Asia/Kabul|34.532|69.175|
|America/Winnipeg|49.888|-97.14|
|America/Danmarkshavn|76.773|-18.677|
|Pacific/Tongatapu|-21.138|-175.203|
|US/Indiana-Starke|41.288|-86.621|
|America/Nassau|25.044|-77.35|
|Europe/Dublin|53.343|-6.272|
|Asia/Kamchatka|53.159|158.432|
|Europe/Zagreb|45.806|15.992|
|Asia/Ulaanbaatar|47.913|106.855|
|America/Chihuahua|28.623|-106.029|
|Asia/Ujung_Pandang|-5.151|119.454|
|Africa/Tripoli|32.884|13.191|
|Iran|33.074|55.579|
|Africa/Timbuktu|16.773|-3.004|
|America/Phoenix|33.462|-112.108|
|Asia/Vladivostok|43.12|131.932|
|Africa/Nouakchott|18.079|-15.965|
|America/Argentina/San_Juan|-30.986|-68.803|
|Africa/Maputo|-25.899|32.6|
|Pacific/Rarotonga|-21.205|-159.794|
|Asia/Macau|22.191|113.545|
|Atlantic/St_Helena|-15.934|-5.72|
|Africa/Lusaka|-15.413|28.304|
|Australia/Brisbane|-27.485|153.04|
|Asia/Rangoon|16.853|96.167|
|America/New_York|40.713|-73.872|
|Asia/Gaza|31.502|34.468|
|Asia/Ashgabat|37.955|58.374|
|Mexico/BajaNorte|29.947|-115.038|
|Africa/Juba|4.855|31.58|
|Mexico/BajaSur|25.255|-111.775|
|America/Dawson_Creek|55.752|-120.237|
|America/Monterrey|25.681|-100.314|
|Pacific/Pohnpei|6.98|158.203|
|Asia/Bishkek|42.877|74.588|
|America/Montevideo|-34.841|-56.197|
|Africa/Accra|5.589|-0.182|
|Asia/Shanghai|31.048|121.452|
|Europe/Ljubljana|46.063|14.513|
|Asia/Manila|14.6|120.991|
|Asia/Tbilisi|41.724|44.8|
|Australia/LHI|-31.554|159.087|
|America/Barbados|13.165|-59.554|
|Brazil/DeNoronha|-3.857|-32.427|
|Asia/Baghdad|33.315|44.366|
|Australia/Sydney|-33.843|151.044|
|Asia/Barnaul|53.349|83.762|
|America/Nome|64.5|-165.407|
|Europe/Minsk|53.901|27.559|
|Canada/Atlantic|53.536|-63.999|
|Europe/Brussels|50.846|4.35|
|Pacific/Kanton|-2.769|-171.718|
|Australia/Perth|-31.968|115.889|
|Africa/Casablanca|33.56|-7.594|
|Africa/Windhoek|-22.57|17.077|
|Antarctica/Rothera|-67.569|-68.124|
|Europe/Tirane|41.328|19.818|
|Asia/Kuwait|29.338|47.63|
|America/Detroit|42.35|-83.099|
|NZ-CHAT|-43.925|-176.525|
|Asia/Urumqi|43.812|87.599|
|Europe/Andorra|42.518|1.555|
|Asia/Amman|31.901|35.938|
|America/Port_of_Spain|10.665|-61.509|
|America/Matamoros|25.853|-97.505|
|Indian/Kerguelen|-49.349|70.22|
|Africa/Banjul|13.452|-16.577|
|Pacific/Pago_Pago|-14.276|-170.706|
|Europe/Istanbul|40.996|29.116|
|Pacific/Samoa|-13.84|-171.76|
|Asia/Thimphu|27.467|89.638|
|Atlantic/Jan_Mayen|70.922|-8.717|
|CST6CDT|36.533|-94.598|
|Asia/Muscat|23.575|58.383|
|Asia/Tashkent|41.299|69.256|
|Asia/Chungking|29.563|106.453|
|Asia/Yangon|16.853|96.167|
|Africa/Khartoum|15.53|32.542|
|Canada/Pacific|49.207|-119.818|
|Asia/Pyongyang|39.067|125.788|
|Pacific/Honolulu|21.29|-157.816|
|Pacific/Efate|-17.729|168.316|
|Asia/Novokuznetsk|53.757|87.119|
|America/Aruba|12.516|-69.981|
|Atlantic/Reykjavik|64.125|-21.848|
|America/Hermosillo|29.084|-110.959|
|Europe/Bratislava|48.131|17.13|
|Pacific/Ponape|6.963|158.211|
|America/Edmonton|53.498|-113.522|
|America/Metlakatla|55.124|-131.57|
|Brazil/Acre|-8.874|-70.594|
|America/Rainy_River|48.722|-94.567|
|Pacific/Johnston|16.728|-169.534|
|America/Santarem|-2.447|-54.713|
|Asia/Nicosia|35.179|33.376|
|America/Sao_Paulo|-23.569|-46.672|
|Asia/Kuching|1.569|110.321|
|Africa/Cairo|30.048|31.239|
|Australia/Tasmania|-42.168|146.487|
|Asia/Damascus|33.507|36.299|
|Europe/Volgograd|48.696|44.469|
|Asia/Chongqing|29.584|106.561|
|America/Belize|17.249|-88.775|
|Africa/Addis_Ababa|9.011|38.759|
|Europe/Gibraltar|36.13|-5.347|
|Europe/Nicosia|35.182|33.386|
|US/Pacific|41.735|-122.635|
|America/Fortaleza|-3.779|-38.545|
|America/Nuuk|64.173|-51.738|
|America/Adak|51.867|-176.639|
|Europe/Kaliningrad|54.711|20.495|
|Asia/Krasnoyarsk|56.019|92.876|
|America/Boa_Vista|2.812|-60.712|
|US/East-Indiana|40.023|-85.19|
|America/Martinique|14.672|-61.023|
|Asia/Dubai|25.181|55.315|
|CET|46.601|4.069|
|Europe/Astrakhan|46.34|48.021|
|W-SU|58.535|36.392|
|Pacific/Norfolk|-29.034|167.953|
|America/Vancouver|49.233|-123.102|
|Israel|31.626|34.758|
|America/Glace_Bay|46.197|-59.957|
|Asia/Seoul|37.561|126.989|
|Asia/Phnom_Penh|11.563|104.871|
|Pacific/Bougainville|-6.38|155.434|
|America/Thule|77.468|-69.231|
|America/El_Salvador|13.777|-89.206|
|Indian/Antananarivo|-18.9|47.52|
|America/Guayaquil|-2.174|-79.915|
|Asia/Ust-Nera|64.568|143.235|
|America/Kentucky/Monticello|36.83|-84.849|
|America/Argentina/San_Luis|-33.297|-66.335|
|Asia/Kashgar|39.479|76.013|
|Canada/Newfoundland|53.532|-64.007|
|Pacific/Tahiti|-17.532|-149.556|
|America/St_Kitts|17.297|-62.724|
|America/Swift_Current|50.282|-107.797|
|Europe/Saratov|51.564|45.991|
|Europe/Riga|56.956|24.121|
|America/Godthab|64.175|-51.738|
|Europe/Stockholm|59.302|18.02|
|America/Cordoba|-31.409|-64.184|
|Australia/Currie|-39.93|143.854|
|Australia/NSW|-33.089|147.147|
|Pacific/Nauru|-0.527|166.935|
|America/Argentina/Mendoza|-32.884|-68.861|
|Asia/Singapore|1.349|103.792|
|Africa/Malabo|3.748|8.775|
|MET|44.936|8.572|
|America/Paramaribo|5.842|-55.201|
|Europe/Oslo|59.926|10.776|
|Canada/Mountain|55.759|-120.225|
|Australia/Adelaide|-34.909|138.577|
|Africa/Mbabane|-26.323|31.144|
|Asia/Anadyr|64.733|177.501|
|Asia/Calcutta|22.524|88.352|
|US/Arizona|34.329|-112.121|
|Asia/Katmandu|27.706|85.323|

For example you can use [https://maps.googleapis.com/maps/api/geocode/json?address=27.706,85.323&key=API_KEY](https://maps.googleapis.com/maps/api/geocode/json?address=27.706,85.323&key=API_KEY) to programatically get more informations about **Kathmandu, Nepal**.
