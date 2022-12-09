<template>
    <div class="box">
        <v-tabs v-model="tab" class="mb-12" color="#000">
            <v-tab><h1>HOTO</h1></v-tab>
            <v-tab><h1>Redeem</h1></v-tab>
            <v-tab><h1>Games</h1></v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <!--HOTO-->
            <v-tab-item>
                <v-data-table
                    :headers="headersHOTO"
                    :items="dataHOTO"
                    item-key="serialNum"
                    class="elevation-1"
                    :search="searchHOTO"
                    multi-sort
                >
                    <template v-slot:top>
                        <v-text-field
                        v-model="searchHOTO"
                        color="#000"
                        label="Search..."
                        class="mx-4"
                        ></v-text-field>
                    </template>

                    <!--icons-->
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteItem(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
                <!--Edit HOTO dialog-->
            </v-tab-item>

            <!--Redeem-->
            <v-tab-item>
                <v-data-table
                    :headers="headersVR"
                    :items="dataVR"
                    item-key="serialNum"
                    class="elevation-1"
                    :search="searchVR"
                    multi-sort
                >
                    <template v-slot:top>
                        <v-text-field
                        v-model="searchVR"
                        color="#000"
                        label="Search..."
                        class="mx-4"
                        ></v-text-field>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteItem(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
            
            <!--Games-->
            <v-tab-item>
                <v-data-table
                    :headers="headersGames"
                    :items="dataGames"
                    item-key="serialNum"
                    class="elevation-1"
                    :search="searchGames"
                    multi-sort
                >
                    <template v-slot:top>
                        <v-text-field
                        v-model="searchGames"
                        color="#000"
                        label="Search..."
                        class="mx-4"
                        ></v-text-field>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editItem(item)"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteItem(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import { doc, collection, getDocs, onSnapshot, addDoc, updateDoc, query, where } from "firebase/firestore";

    export default {
        data(){
            return {
                tab: null,
                searchHOTO: "",
                searchVR: "",
                searchGames: "",
                headersHOTO: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNums',
                },
                { text: 'Location', value: 'location' },
                { text: 'Start Date', value: 'sDate' },
                { text: 'End Date', value: 'eDate' },
                { text: 'UID', value: 'uid' },
                { text: 'Actions', value: 'actions', sortable: false }
                ],
                dataHOTO: [],
                headersVR: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'Matriculation No.', value: 'matricNum' },
                { text: 'Location', value: 'location' },
                { text: 'Date', value: 'date' },
                { text: 'UID', value: 'uid' },
                { text: 'Actions', value: 'actions', sortable: false }
                ],
                dataVR: [],
                headersGames: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'UID', value: 'uid' },
                { text: 'Actions', value: 'actions', sortable: false }
                ],
                dataGames: [],
            }
        },
        created() {
            //HOTO
            const hRef = collection(db, 'hotoDB');
            onSnapshot(hRef, (querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
                this.dataHOTO.push({ ...doc.data(), id: doc.id })
                
                var sD = new Date(doc.data().startTime.seconds*1000);
                sD = [String(sD.getDate()).padStart(2, '0'), String(sD.getMonth()+1).padStart(2, '0'), String(sD.getFullYear())].join("/") + " " + [String(sD.getHours()).padStart(2, '0'), String(sD.getMinutes()).padStart(2, '0')].join(":");
                this.dataHOTO[this.dataHOTO.length-1]["sDate"] = sD;

                var eD = new Date(doc.data().endTime.seconds*1000);
                eD = [String(eD.getDate()).padStart(2, '0'), String(eD.getMonth()+1).padStart(2, '0'), String(eD.getFullYear())].join("/") + " " + [String(eD.getHours()).padStart(2, '0'), String(eD.getMinutes()).padStart(2, '0')].join(":");
                this.dataHOTO[this.dataHOTO.length-1]["eDate"] = eD;
            })
            console.log(this.dataHOTO)
            });

            //VR
            const vrRef = collection(db, 'voucherRedemption');
            onSnapshot(vrRef, (querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
                this.dataVR.push({ ...doc.data(), id: doc.id })
                
                var d = new Date(doc.data().timestamp.seconds*1000);
                d = [String(d.getDate()).padStart(2, '0'), String(d.getMonth()+1).padStart(2, '0'), String(d.getFullYear())].join("/") + " " + [String(d.getHours()).padStart(2, '0'), String(d.getMinutes()).padStart(2, '0')].join(":");
                this.dataVR[this.dataVR.length-1]["date"] = d;
            })
            console.log(this.dataVR)
            });

            //Games
            const gRef = collection(db, 'vouchers');
            onSnapshot(gRef, (querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
                if (doc.data().distributionMethod == "games") {
                    this.dataGames.push({ ...doc.data(), id: doc.id })
                }
            })
            console.log(this.dataGames)
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