loop 
wait 
read message
rdata message rid x

if(x==1)
	print "Detected"
	mark 1
else
	print "Not Detected"
	mark 0
end

