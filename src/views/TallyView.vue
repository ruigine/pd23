<template>
    <div class="box">
        <h1 class="mb-12">Tally</h1>

        <v-switch
            v-model="condensed"
            label="Condensed"
            color="success"
        ></v-switch>

        <!--Condensed-->
        <template v-if="condensed">
            <h1 class="my-12">Prize Redemption</h1>
            <v-data-table
                :headers="headersC"
                :items="dataC1"
                class="elevation-1"
                :search="searchInput"
                multi-sort
            >
            <template v-slot:top>
                <v-text-field
                v-model="searchInput"
                color="#000"
                label="Search..."
                class="mx-4"
                ></v-text-field>
            </template>
            </v-data-table>
            <v-expansion-panels class="pt-6">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <b>Total Redeemed: {{totalP}}</b>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        Amount Redeemed by
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                color="success"
                                small
                                v-bind="attrs"
                                v-on="on"
                                >
                                {{sortBy[typeP]}} <v-icon>mdi-menu-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item-group v-model="typeP">
                                    <v-list-item
                                    v-for="(item, index) in sortBy"
                                    :key="index"
                                    >
                                    <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item>
                                 </v-list-item-group>
                            </v-list>
                        </v-menu>

                        <template v-if="typeP==0">
                            <Bar :data="chartDataP1" :options="chartOptionsP1"/>
                        </template>
                        <template v-if="typeP==1">
                            <LineChart :data="chartDataP2" :options="chartOptionsP2"/>
                        </template>
                        <template v-if="typeP==2">
                            <Bar :data="chartDataP3" :options="chartOptionsP3"/>
                        </template>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>


            <h1 class="my-12">Voucher Redemption</h1>
            <v-data-table
                v-if="condensed"
                :headers="headersC"
                :items="dataC2"
                class="elevation-1"
                :search="searchInput"
                multi-sort
            >
            <template v-slot:top>
                <v-text-field
                v-model="searchInput"
                color="#000"
                label="Search..."
                class="mx-4"
                ></v-text-field>
            </template>
            </v-data-table>
            <v-expansion-panels class="pt-6">
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <b>Total Redeemed: {{totalV}}</b>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        Amount Redeemed by
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                color="success"
                                small
                                v-bind="attrs"
                                v-on="on"
                                >
                                {{sortBy[typeV]}} <v-icon>mdi-menu-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item-group v-model="typeV">
                                    <v-list-item
                                    v-for="(item, index) in sortBy"
                                    :key="index"
                                    >
                                    <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item>
                                 </v-list-item-group>
                            </v-list>
                        </v-menu>

                        <template v-if="typeV==0">
                            <Bar :data="chartDataV1" :options="chartOptionsV1"/>
                        </template>
                        <template v-if="typeV==1">
                            <LineChart :data="chartDataV2" :options="chartOptionsV2"/>
                        </template>
                        <template v-if="typeV==2">
                            <Bar :data="chartDataV3" :options="chartOptionsV3"/>
                        </template>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

        </template>

        <!--Detailed-->
        <template v-else>
            <h1 class="my-12">Prize Redemption</h1>
            <v-data-table
                :headers="headersGames"
                :items="dataGames"
                class="elevation-1"
                :search="searchInputGames"
                multi-sort
            >
            <template v-slot:top>
                <v-text-field
                v-model="searchInputGames"
                color="#000"
                label="Search..."
                class="mx-4"
                ></v-text-field>
            </template>
            </v-data-table>

            <h1 class="my-12">Voucher Redemption</h1>
            <v-data-table
                :headers="headersVR"
                :items="dataVR"
                class="elevation-1"
                :search="searchInputVR"
                multi-sort
            >
            <template v-slot:top>
                <v-text-field
                v-model="searchInputVR"
                color="#000"
                label="Search..."
                class="mx-4"
                ></v-text-field>
            </template>
            </v-data-table>
        </template>
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import { doc, collection, getDocs, onSnapshot, addDoc, updateDoc, query, where, orderBy } from "firebase/firestore";

    import { Bar, Line as LineChart } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, )

    export default {
        components: { Bar, LineChart},
        data(){
            return {
                sortBy: ["Day", "Hour", "Location"],
                typeP: 0,
                typeV: 0,
                totalP: 0,
                totalV: 0,
                // P Day
                chartDataP1: {
                    labels: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ],
                    datasets: [ 
                        {
                            data: [0, 0, 0, 0, 0] ,
                            label: 'Redeemed',
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)'
                            ],
                        }
                    ]
                },
                chartOptionsP1: {
                    responsive: true,
                    indexAxis: 'y',
                },
                // P Hour
                chartDataP2: {
                    labels: [ '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00' ],
                    datasets: [ 
                        {
                            data: [] ,
                            label: 'Monday',
                            borderColor: [
                                'rgba(255, 99, 132, 0.5)'
                            ],
                        },
                        {
                            data: [] ,
                            label: 'Tuesday',
                            borderColor: [
                                'rgba(255, 159, 64, 0.5)'
                            ],
                        },
                        {
                            data: [] ,
                            label: 'Wednesday',
                            borderColor: [
                                'rgba(255, 205, 86, 0.5)'
                            ],
                        },
                        {
                            data: [] ,
                            label: 'Thursday',
                            borderColor: [
                                'rgba(75, 192, 192, 0.5)'
                            ],
                        },
                        {
                            data: [] ,
                            label: 'Friday',
                            borderColor: [
                                'rgba(54, 162, 235, 0.5)'
                            ],
                        }
                    ]
                },
                chartOptionsP2: {
                    responsive: true,
                },
                // P Location
                chartDataP3: {
                    labels: [ 'Koufu', 'SOB', 'Connexion', 'SMOO Hub' ],
                    datasets: [ 
                        {
                            data: [0, 0, 0, 0] ,
                            label: 'Redeemed',
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                            ],
                        }
                    ]
                },
                chartOptionsP3: {
                    responsive: true,
                    indexAxis: 'y',
                },

                // V Day
                chartDataV1: {
                    labels: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ],
                    datasets: [ 
                        {
                            data: [0, 0, 0, 0, 0] ,
                            label: 'Redeemed',
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)'
                            ],
                        }
                    ]
                },
                chartOptionsV1: {
                    responsive: true,
                    indexAxis: 'y',
                },
                // V Hour
                chartDataV2: {
                    labels: [ '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00' ],
                    datasets: [ 
                        {
                            data: [] ,
                            label: 'Monday',
                            borderColor: [
                                'rgba(255, 99, 132, 0.5)'
                            ],
                        },
                        {
                            data: [] ,
                            label: 'Tuesday',
                            borderColor: [
                                'rgba(255, 159, 64, 0.5)'
                            ],
                        },
                        {
                            data: [] ,
                            label: 'Wednesday',
                            borderColor: [
                                'rgba(255, 205, 86, 0.5)'
                            ],
                        },
                        {
                            data: [] ,
                            label: 'Thursday',
                            borderColor: [
                                'rgba(75, 192, 192, 0.5)'
                            ],
                        },
                        {
                            data: [] ,
                            label: 'Friday',
                            borderColor: [
                                'rgba(54, 162, 235, 0.5)'
                            ],
                        }
                    ]
                },
                chartOptionsV2: {
                    responsive: true,
                },
                // V Location
                chartDataV3: {
                    labels: [ 'Koufu', 'SOB', 'Connexion', 'SMOO Hub' ],
                    datasets: [ 
                        {
                            data: [0, 0, 0, 0] ,
                            label: 'Redeemed',
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                            ],
                        }
                    ]
                },
                chartOptionsV3: {
                    responsive: true,
                    indexAxis: 'y',
                },
        

                condensed: true,
                searchInput: "",
                searchInputVR: "",
                searchInputGames: "",
                headersVR: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'Available', value: 'isAvailable' },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Location', value: 'location' },
                { text: 'Date', value: 'date' },
                { text: 'Email', value: 'email' }
                ],
                headersGames: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'Available', value: 'isAvailable' },
                { text: 'Name', value: 'name' },
                { text: 'Telephone', value: 'telephone' },
                { text: 'Prize', value: 'prize' },
                { text: 'Location', value: 'location' },
                { text: 'Date', value: 'date' },
                { text: 'Email', value: 'email' },
                { text: 'Hourly?', value: 'HD'}
                ],
                headersC: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'Available', value: 'isAvailable' }
                ],
                dataVR: [],
                dataGames: [],
                dataC1: [],
                dataC2: [],
            }
        },
        created() {
            this.getGames();
            this.getVouchers();
            this.getGamesHours();
            this.getVoucherHours();
        },
        methods: {
            getGames() {
                const gRef = query(collection(db, 'prize'), orderBy("serialNum"));
                onSnapshot(gRef, (querySnapshot) => {
                var v = {}; var s = []; this.chartDataP1.datasets[0].data = [0, 0, 0, 0, 0]; this.chartDataP3.datasets[0].data = [0, 0, 0, 0]; this.totalP = 0;
                querySnapshot.docs.forEach((doc) => {
                    var d = new Date(doc.data().date.seconds*1000);
                    this.totalP += doc.data().serialNum.length

                    //  Date
                        // Monday
                        if (d.toDateString() == new Date('2023-01-09').toDateString()) {
                            this.chartDataP1.datasets[0].data[0] += doc.data().serialNum.length;
                        }
                        // Tuesday
                        if (d.toDateString() == new Date('2023-01-10').toDateString()) {
                            this.chartDataP1.datasets[0].data[1] += doc.data().serialNum.length;
                        }
                        // Wednesday
                        if (d.toDateString() == new Date('2023-01-11').toDateString()) {
                            this.chartDataP1.datasets[0].data[2] += doc.data().serialNum.length;
                        }
                        // Thursday
                        if (d.toDateString() == new Date('2023-01-12').toDateString()) {
                            this.chartDataP1.datasets[0].data[3] += doc.data().serialNum.length;
                        }
                        // Friday
                        if (d.toDateString() == new Date('2023-01-13').toDateString()) {
                            this.chartDataP1.datasets[0].data[4] += doc.data().serialNum.length;
                        }

                    // Location
                        if (doc.data().location == "Koufu") {
                            this.chartDataP3.datasets[0].data[0] += doc.data().serialNum.length;
                        }
                        if (doc.data().location == "SOB") {
                            this.chartDataP3.datasets[0].data[1] += doc.data().serialNum.length;
                        }
                        if (doc.data().location == "Connexion") {
                            this.chartDataP3.datasets[0].data[2] += doc.data().serialNum.length;
                        }
                        if (doc.data().location == "SMOO Hub") {
                            this.chartDataP3.datasets[0].data[3] += doc.data().serialNum.length;
                        }
                    

                    d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                    
                    for (var sn of doc.data().serialNum) {
                        v[sn] = { ...doc.data() };
                        v[sn]["date"] = d;
                    }
                    
                    s = s.concat(doc.data().serialNum);
                })
                s = s.filter(sn => !!sn)
                console.log(v);
                console.log(s);


                var range = []; var bool = "";
                for (var i=1901; i<=2580; i++) {
                    if (i == 1901) {
                        range.push(i);
                        bool = s.includes(i) ? "No" : "Yes";
                    } else {
                        if ((s.includes(i) ? "No" : "Yes") != bool) {
                            range.push(i-1);
                            if (range[0] == range[1]) {
                                this.dataC1.push({ serialNum: range[0], isAvailable: bool });
                            } else {
                                this.dataC1.push({ serialNum: range.join("-"), isAvailable: (s.includes(i-1) ? "No" : "Yes") });
                            }
                            range = [i];
                            bool = s.includes(i) ? "No" : "Yes";

                            if (i == 2580) {
                                this.dataC1.push({ serialNum: i, isAvailable: (s.includes(i) ? "No" : "Yes") });
                            }
                        } else if (i == 2580) {
                            range.push(i);
                            this.dataC1.push({ serialNum: range.join("-"), isAvailable: s.includes(i-1) ? "No" : "Yes" });
                        }
                    }

                    if (s.includes(i)) {
                        v[i]["isAvailable"] = "No";
                        v[i]["serialNum"] = i;

                        if (v[i]["hourly"]) {
                            v[i]["HD"] = "Yes";
                        } else {
                            v[i]["HD"] = "No";
                        }

                        this.dataGames.push(v[i]);
                    } else {
                        this.dataGames.push({
                            isAvailable: "Yes",
                            serialNum: i,
                            telephone: "",
                            location: "",
                            date: "",
                            email: ""
                        })
                    }
                }
                });
            },
            getVouchers() {
                const vRef = query(collection(db, 'vouchers'), orderBy("serialNum"));
                onSnapshot(vRef, (querySnapshot) => {
                var v = {}; var s = []; this.chartDataV1.datasets[0].data = [0, 0, 0, 0, 0]; this.chartDataV3.datasets[0].data = [0, 0, 0, 0]; this.totalV = 0;
                querySnapshot.docs.forEach((doc) => {
                    var d = new Date(doc.data().date.seconds*1000);
                    this.totalV += 1;

                    // Date
                        // Monday
                        if (d.toDateString() == new Date('2023-01-09').toDateString()) {
                            this.chartDataV1.datasets[0].data[0] += 1;
                        }
                        // Tuesday
                        if (d.toDateString() == new Date('2023-01-10').toDateString()) {
                            this.chartDataV1.datasets[0].data[1] += 1;
                        }
                        // Wednesday
                        if (d.toDateString() == new Date('2023-01-11').toDateString()) {
                            this.chartDataV1.datasets[0].data[2] += 1;
                        }
                        // Thursday
                        if (d.toDateString() == new Date('2023-01-12').toDateString()) {
                            this.chartDataV1.datasets[0].data[3] += 1;
                        }
                        // Friday
                        if (d.toDateString() == new Date('2023-01-13').toDateString()) {
                            this.chartDataV1.datasets[0].data[4] += 1;
                        }

                    // Location
                        if (doc.data().location == "Koufu") {
                            this.chartDataV3.datasets[0].data[0] += 1;
                        }
                        if (doc.data().location == "SOB") {
                            this.chartDataV3.datasets[0].data[1] += 1;
                        }
                        if (doc.data().location == "Connexion") {
                            this.chartDataV3.datasets[0].data[2] += 1;
                        }
                        if (doc.data().location == "SMOO Hub") {
                            this.chartDataV3.datasets[0].data[3] += 1;
                        }

                    d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");

                    v[Number(doc.data().serialNum)] = { ...doc.data() };
                    v[Number(doc.data().serialNum)]["date"] = d;
                    s.push(Number(doc.data().serialNum));
                })
                console.log(v);
                console.log(s);


                var range = []; var bool = "";
                for (var i=2581; i<=5880; i++) {
                    if (i == 2581) {
                        range.push(i);
                        bool = s.includes(i) ? "No" : "Yes";
                    } else {
                        if ((s.includes(i) ? "No" : "Yes") != bool) {
                            range.push(i-1);
                            if (range[0] == range[1]) {
                                this.dataC2.push({ serialNum: range[0], isAvailable: bool });
                            } else {
                                this.dataC2.push({ serialNum: range.join("-"), isAvailable: (s.includes(i-1) ? "No" : "Yes") });
                            }
                            range = [i];
                            bool = s.includes(i) ? "No" : "Yes";

                            if (i == 5880) {
                                this.dataC2.push({ serialNum: i, isAvailable: (s.includes(i) ? "No" : "Yes") });
                            }
                        } else if (i == 5880) {
                            range.push(i);
                            this.dataC2.push({ serialNum: range.join("-"), isAvailable: s.includes(i-1) ? "No" : "Yes" });
                        }
                    }

                    if (s.includes(i)) {
                        v[i]["isAvailable"] = "No";
                        this.dataVR.push(v[i]);
                    } else {
                        this.dataVR.push({
                            isAvailable: "Yes",
                            serialNum: i,
                            matricNum: "",
                            location: "",
                            date: "",
                            email: ""
                        })
                    }
                }
                });
            },
            getGamesHours() {
                const gRef = query(collection(db, 'prize'), orderBy("date"));
                this.chartDataP2.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
                this.chartDataP2.datasets[1].data = [0, 0, 0, 0, 0, 0, 0];
                this.chartDataP2.datasets[2].data = [0, 0, 0, 0, 0, 0, 0];
                this.chartDataP2.datasets[3].data = [0, 0, 0, 0, 0, 0, 0];
                this.chartDataP2.datasets[4].data = [0, 0, 0, 0, 0, 0, 0];
                onSnapshot(gRef, (querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                    if (doc.data().serialNum) {
                        var d = new Date(doc.data().date.seconds*1000);

                        // Monday
                        if (d.toDateString() == new Date('2023-01-09').toDateString()) {
                            for (var m=10; m<=16; m++) {
                                if (d.getHours() == m) {
                                    this.chartDataP2.datasets[0].data[m-10] += doc.data().serialNum.length
                                }
                            }
                        }
                        // Tuesday
                        if (d.toDateString() == new Date('2023-01-10').toDateString()) {
                            for (var t=10; t<=16; t++) {
                                if (d.getHours() == t) {
                                    this.chartDataP2.datasets[1].data[t-10] += doc.data().serialNum.length
                                }
                            }
                        }
                        // Wednesday
                        if (d.toDateString() == new Date('2023-01-11').toDateString()) {
                            for (var w=10; w<=16; w++) {
                                if (d.getHours() == w) {
                                    this.chartDataP2.datasets[2].data[w-10] += doc.data().serialNum.length
                                }
                            }
                        }
                        // Thursday
                        if (d.toDateString() == new Date('2023-01-12').toDateString()) {
                            for (var th=10; th<=16; th++) {
                                if (d.getHours() == th) {
                                    this.chartDataP2.datasets[3].data[th-10] += doc.data().serialNum.length
                                }
                            }
                        }
                        // Friday
                        if (d.toDateString() == new Date('2023-01-13').toDateString()) {
                            for (var f=10; f<=16; f++) {
                                if (d.getHours() == f) {
                                    this.chartDataP2.datasets[4].data[f-10] += doc.data().serialNum.length
                                }
                            }
                        }
                    }
                })
                })
            },
            getVoucherHours() {
                const vRef = query(collection(db, 'vouchers'), orderBy("date"));
                this.chartDataV2.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
                this.chartDataV2.datasets[1].data = [0, 0, 0, 0, 0, 0, 0];
                this.chartDataV2.datasets[2].data = [0, 0, 0, 0, 0, 0, 0];
                this.chartDataV2.datasets[3].data = [0, 0, 0, 0, 0, 0, 0];
                this.chartDataV2.datasets[4].data = [0, 0, 0, 0, 0, 0, 0];
                onSnapshot(vRef, (querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                    var d = new Date(doc.data().date.seconds*1000);

                    // Monday
                    if (d.toDateString() == new Date('2023-01-09').toDateString()) {
                        for (var m=10; m<=16; m++) {
                            if (d.getHours() == m) {
                                this.chartDataV2.datasets[0].data[m-10] += 1
                            }
                        }
                    }
                    // Tuesday
                    if (d.toDateString() == new Date('2023-01-10').toDateString()) {
                        for (var t=10; t<=16; t++) {
                            if (d.getHours() == t) {
                                this.chartDataV2.datasets[1].data[t-10] += 1
                            }
                        }
                    }
                    // Wednesday
                    if (d.toDateString() == new Date('2023-01-11').toDateString()) {
                        for (var w=10; w<=16; w++) {
                            if (d.getHours() == w) {
                                this.chartDataV2.datasets[2].data[w-10] += 1
                            }
                        }
                    }
                    // Thursday
                    if (d.toDateString() == new Date('2023-01-12').toDateString()) {
                        for (var th=10; th<=16; th++) {
                            if (d.getHours() == th) {
                                this.chartDataV2.datasets[3].data[th-10] += 1
                            }
                        }
                    }
                    // Friday
                    if (d.toDateString() == new Date('2023-01-13').toDateString()) {
                        for (var f=10; f<=16; f++) {
                            if (d.getHours() == f) {
                                this.chartDataV2.datasets[4].data[f-10] += 1
                            }
                        }
                    }
                })
                })
            }
        }
    };
</script>

<style lang="css" scoped>
    .box {
        width: 80%;
        margin: 5% auto 5% auto;
    }
</style>