import Kafka from "kafka-node"
const {Producer,KafkaClient}=Kafka



const client = new KafkaClient({
    kafkaHost:process.env.KAFKA_HOST
})




const producer = new Producer(client)

producer.on("ready",()=>{
    console.log("Kafka Producer is ready")
})

producer.on("error", (err) => {
    console.error("Kafka Producer error:", err)
})



const KafkaTopics = (topic, message , eventName) => {
     const payloads = [
        {
            topic: topic,
            messages: JSON.stringify({ eventName, message }),
            partition: 0
        }
    ]


    producer.send(payloads,(error,result)=>{
            if(error){
                console.log("error in kafka producer : ",error);
                return
                
            }


            console.log("kafka event send",result);
            
    })



}
