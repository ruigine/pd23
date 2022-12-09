<template>
    <div class="box">
        <!--HOTO-->
        <h1 class="mb-12">HOTO</h1>
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
        </v-data-table>


        <!--Redeem-->
        <h1 class="my-12">Voucher Redemption</h1>
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
        </v-data-table>

        
        <!--Games-->
        <h1 class="my-12">Games</h1>
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
        </v-data-table>
    </div>
</template>
<script>
    import { db } from "../firebase/firebaseinit";
    import { doc, collection, getDocs, onSnapshot, addDoc, updateDoc, query, where } from "firebase/firestore";

    export default {
        data(){
            return {
                dialog: false,
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
                { text: 'UID', value: 'uid' }
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
                { text: 'UID', value: 'uid' }
                ],
                dataVR: [],
                headersGames: [
                {
                    text: 'S/N',
                    align: 'start',
                    sortable: true,
                    value: 'serialNum',
                },
                { text: 'UID', value: 'uid' }
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