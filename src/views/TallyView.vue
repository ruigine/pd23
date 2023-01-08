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

    export default {
        data(){
            return {
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
            //Games
            const gRef = query(collection(db, 'prize'), orderBy("serialNum"));
            onSnapshot(gRef, (querySnapshot) => {
            var v = {}; var s = [];
            querySnapshot.docs.forEach((doc) => {
                var d = new Date(doc.data().date.seconds*1000);
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


            //Vouchers
            const vRef = query(collection(db, 'vouchers'), orderBy("serialNum"));
            onSnapshot(vRef, (querySnapshot) => {
            var v = {}; var s = [];
            querySnapshot.docs.forEach((doc) => {
                var d = new Date(doc.data().date.seconds*1000);
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
    };
</script>

<style lang="css" scoped>
    .box {
        width: 80%;
        margin: 5% auto 5% auto;
    }
</style>