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
            @click:row="detail"
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

        <v-dialog
            v-model="dialog"
            max-width="600"
        >
            <v-card class="pa-5">   
                <div class="text-h5 pa-4">Voucher Redemption</div>

                <v-list-item two-line v-for="cat in currCat" :key="cat.name">
                    <v-list-item-content>
                        <v-list-item-title>{{cat.name}}</v-list-item-title>
                        <v-list-item-subtitle>{{curr[cat.value]}}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="dialog = false"
                >
                    Close
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import { doc, collection, getDocs, onSnapshot, addDoc, updateDoc, query, where, orderBy } from "firebase/firestore";

    export default {
        data(){
            return {
                dialog: false,
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
                { text: 'Distribution Method', value: 'distributionMethod' },
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
                curr: {},
                currCat: [
                    {name: "Location", value: "location"},
                    {name: "Matriculation Number", value: "matricNum"},
                    {name: "Serial Number", value: "serialNum"},
                    {name: "Date", value: "date"},
                    {name: "Email", value: "email"}
                ]
            }
        },
        created() {
            const vRef = query(collection(db, 'vouchers'), orderBy("serialNum"));
            onSnapshot(vRef, (querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
                this.data.push({ ...doc.data(), id: doc.id })
            })
            console.log(this.data);
            
            var range = []; var bool = [];
            for (var i=0; i<this.data.length; i++) {
                console.log(i, range, bool)
                if (i == 0) {
                    range.push(this.data[i].serialNum);
                    bool = this.data[i].isAvailable;
                } else {
                    if (this.data[i].isAvailable != bool) {
                        range.push(this.data[i-1].serialNum);
                        if (range[0] == range[1]) {
                            this.dataC.push({ serialNum: range[0], isAvailable: bool });
                        } else {
                            this.dataC.push({ serialNum: range.join("-"), isAvailable: this.data[i-1].isAvailable });
                        }
                        range = [this.data[i].serialNum];
                        bool = this.data[i].isAvailable;

                        if (i == this.data.length - 1) {
                            this.dataC.push({ serialNum: this.data[i].serialNum, isAvailable: this.data[i].isAvailable });
                        }
                    } else if (i == this.data.length - 1) {
                        range.push(this.data[i].serialNum);
                        this.dataC.push({ serialNum: range.join("-"), isAvailable: this.data[i-1].isAvailable });
                    }
                }
            }
            });
        },
        methods: {
            detail(item) {
                console.log(item)
                if (item.distributionMethod == "Voucher Redemption") {
                    getDocs(query(collection(db, 'voucherRedemption'), where("serialNum", "==", item.serialNum)))
                    .then((snapshot) => {
                        snapshot.docs.forEach((doc) => {
                            this.curr = { ...doc.data(), id: doc.id }
                            
                            var d = new Date(doc.data().timestamp.seconds*1000);
                            d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                            this.curr["date"] = d;
                        })
                        this.dialog = true;
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
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