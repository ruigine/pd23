<template>
    <div class="box">
        <h1 class="mb-12">Tally</h1>

        <v-switch
            v-model="condensed"
            label="Condensed"
        ></v-switch>

        <!--Condensed-->
        <v-data-table
            v-if="condensed"
            :headers="headersC"
            :items="dataC"
            item-key="serialNum"
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

        <!--Detailed-->
        <v-data-table
            v-else
            :headers="headers"
            :items="data"
            item-key="serialNum"
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
                headers: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'Available', value: 'isAvailable' },
                 { text: 'Redemption Method', value: 'method' },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Location', value: 'location' },
                { text: 'Date', value: 'date' },
                { text: 'Email', value: 'email' }
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
                data: [],
                dataC: [],
            }
        },
        created() {
            //Games
            const gRef = query(collection(db, 'games'), orderBy("serialNum"));
            onSnapshot(gRef, (querySnapshot) => {
            var v = {}; var s = [];
            querySnapshot.docs.forEach((doc) => {
                var d = new Date(doc.data().date.seconds*1000);
                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                
                v[Number(doc.data().serialNum)] = { ...doc.data(), id: doc.id, method: "Games" };
                v[Number(doc.data().serialNum)]["date"] = d;
                s.push(Number(doc.data().serialNum));
            })
            console.log(v);
            console.log(s);
            
            var range = []; var bool = "";
            for (var i=1901; i<=2420; i++) {
                if (i == 1901) {
                    range.push(i);
                    bool = s.includes(i) ? "No" : "Yes";
                } else {
                    if (s.includes(i) ? "No" : "Yes" != bool) {
                        range.push(i-1);
                        if (range[0] == range[1]) {
                            this.dataC.push({ serialNum: range[0], isAvailable: bool });
                        } else {
                            this.dataC.push({ serialNum: range.join("-"), isAvailable: (s.includes(i-1) ? "No" : "Yes") });
                        }
                        range = [i];
                        bool = s.includes(i) ? "No" : "Yes";

                        if (i == 2420) {
                            this.dataC.push({ serialNum: i, isAvailable: (s.includes(i) ? "No" : "Yes") });
                        }
                    } else if (i == 2420) {
                        range.push(i);
                        this.dataC.push({ serialNum: range.join("-"), isAvailable: s.includes(i-1) ? "No" : "Yes" });
                    }
                }

                if (s.includes(i)) {
                    v[i]["isAvailable"] = "No";
                    this.data.push(v[i]);
                } else {
                    this.data.push({
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


            //Vouchers
            const vRef = query(collection(db, 'vouchers'), orderBy("serialNum"));
            onSnapshot(vRef, (querySnapshot) => {
            var v = {}; var s = [];
            querySnapshot.docs.forEach((doc) => {
                var d = new Date(doc.data().date.seconds*1000);
                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");

                v[Number(doc.data().serialNum)] = { ...doc.data(), id: doc.id, method: "Voucher" };
                v[Number(doc.data().serialNum)]["date"] = d;
                s.push(Number(doc.data().serialNum));
            })
            console.log(v);
            console.log(s);
            
            var range = []; var bool = "";
            for (var i=2421; i<=5880; i++) {
                if (i == 2421) {
                    range.push(i);
                    bool = s.includes(i) ? "No" : "Yes";
                } else {
                    if (s.includes(i) ? "No" : "Yes" != bool) {
                        range.push(i-1);
                        if (range[0] == range[1]) {
                            this.dataC.push({ serialNum: range[0], isAvailable: bool });
                        } else {
                            this.dataC.push({ serialNum: range.join("-"), isAvailable: (s.includes(i-1) ? "No" : "Yes") });
                        }
                        range = [i];
                        bool = s.includes(i) ? "No" : "Yes";

                        if (i == 5880) {
                            this.dataC.push({ serialNum: i, isAvailable: (s.includes(i) ? "No" : "Yes") });
                        }
                    } else if (i == 5880) {
                        range.push(i);
                        this.dataC.push({ serialNum: range.join("-"), isAvailable: s.includes(i-1) ? "No" : "Yes" });
                    }
                }

                if (s.includes(i)) {
                    v[i]["isAvailable"] = "No";
                    this.data.push(v[i]);
                } else {
                    this.data.push({
                        isAvailable: "Yes",
                        serialNum: i,
                        matricNum: "",
                        method: "",
                        location: "",
                        date: "",
                        email: ""
                    })
                }
            }
            });
        },
        methods: {
        }
    };
</script>

<style lang="css" scoped>
    .box {
        width: 80%;
        margin: 5% auto 5% auto;
    }
</style>