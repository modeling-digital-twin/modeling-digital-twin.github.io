atget id id
loop
wait 
read message
rdata message rid x
data message2 id x
send message2 * rid
